import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isCasting: boolean;
  isRecreador: boolean;
  profissionalId: string | null;
  isLoading: boolean;
  needsMFA: boolean;
  mfaVerified: boolean;
  currentAAL: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; needsMFASetup?: boolean; needsMFAVerify?: boolean }>;
  signOut: () => Promise<void>;
  checkMFAStatus: () => Promise<{ needsSetup: boolean; needsVerify: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [isRecreador, setIsRecreador] = useState(false);
  const [profissionalId, setProfissionalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsMFA, setNeedsMFA] = useState(false);
  const [mfaVerified, setMfaVerified] = useState(false);
  const [currentAAL, setCurrentAAL] = useState<string | null>(null);

  const checkUserRoles = async (userId: string) => {
    try {
      // Check all roles in parallel
      const [adminRes, castingRes, recreadorRes] = await Promise.all([
        supabase.rpc('has_role', { _user_id: userId, _role: 'admin' }),
        supabase.rpc('has_role', { _user_id: userId, _role: 'casting' }),
        supabase.rpc('has_role', { _user_id: userId, _role: 'recreador' }),
      ]);

      const isAdminUser = adminRes.data === true;
      const isCastingUser = castingRes.data === true;
      const isRecreadorUser = recreadorRes.data === true;

      // If recreador, get profissional_id
      let profId: string | null = null;
      if (isRecreadorUser) {
        const { data } = await supabase
          .from('profissional_auth')
          .select('profissional_id')
          .eq('user_id', userId)
          .single();
        profId = data?.profissional_id || null;
      }

      return {
        isAdmin: isAdminUser,
        isCasting: isCastingUser,
        isRecreador: isRecreadorUser,
        profissionalId: profId,
      };
    } catch (err) {
      console.error('Error checking user roles:', err);
      return {
        isAdmin: false,
        isCasting: false,
        isRecreador: false,
        profissionalId: null,
      };
    }
  };

  const checkMFAStatus = async (): Promise<{ needsSetup: boolean; needsVerify: boolean }> => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return { needsSetup: false, needsVerify: false };

      // Check if user is admin or casting (they need MFA)
      const roles = await checkUserRoles(currentUser.id);
      const requiresMFA = roles.isAdmin || roles.isCasting;

      if (!requiresMFA) {
        setNeedsMFA(false);
        setMfaVerified(true);
        return { needsSetup: false, needsVerify: false };
      }

      setNeedsMFA(true);

      // Check MFA factors
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const hasVerifiedTOTP = factors?.totp?.some(f => f.status === 'verified') || false;

      if (!hasVerifiedTOTP) {
        // Needs to set up MFA
        setMfaVerified(false);
        return { needsSetup: true, needsVerify: false };
      }

      // Check current AAL level
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      
      if (aalData) {
        setCurrentAAL(aalData.currentLevel);
      }

      if (aalData?.currentLevel === 'aal2') {
        // MFA verified for this session
        setMfaVerified(true);
        return { needsSetup: false, needsVerify: false };
      }

      // Has TOTP but hasn't verified this session
      setMfaVerified(false);
      return { needsSetup: false, needsVerify: true };
    } catch (err) {
      console.error('Error checking MFA status:', err);
      return { needsSetup: false, needsVerify: false };
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(async () => {
            const roles = await checkUserRoles(session.user.id);
            setIsAdmin(roles.isAdmin);
            setIsCasting(roles.isCasting);
            setIsRecreador(roles.isRecreador);
            setProfissionalId(roles.profissionalId);
            
            // Check MFA status
            await checkMFAStatus();
            
            setIsLoading(false);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsCasting(false);
          setIsRecreador(false);
          setProfissionalId(null);
          setNeedsMFA(false);
          setMfaVerified(false);
          setCurrentAAL(null);
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        checkUserRoles(session.user.id).then(async roles => {
          setIsAdmin(roles.isAdmin);
          setIsCasting(roles.isCasting);
          setIsRecreador(roles.isRecreador);
          setProfissionalId(roles.profissionalId);
          
          // Check MFA status
          await checkMFAStatus();
          
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // After successful login, check MFA requirements
    if (data.user) {
      const mfaStatus = await checkMFAStatus();
      return { 
        error: null, 
        needsMFASetup: mfaStatus.needsSetup,
        needsMFAVerify: mfaStatus.needsVerify
      };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsCasting(false);
    setIsRecreador(false);
    setProfissionalId(null);
    setNeedsMFA(false);
    setMfaVerified(false);
    setCurrentAAL(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAdmin, 
      isCasting, 
      isRecreador, 
      profissionalId, 
      isLoading,
      needsMFA,
      mfaVerified,
      currentAAL,
      signIn, 
      signOut,
      checkMFAStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

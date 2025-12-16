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
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
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
            setIsLoading(false);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsCasting(false);
          setIsRecreador(false);
          setProfissionalId(null);
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        checkUserRoles(session.user.id).then(roles => {
          setIsAdmin(roles.isAdmin);
          setIsCasting(roles.isCasting);
          setIsRecreador(roles.isRecreador);
          setProfissionalId(roles.profissionalId);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsCasting(false);
    setIsRecreador(false);
    setProfissionalId(null);
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
      signIn, 
      signOut 
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

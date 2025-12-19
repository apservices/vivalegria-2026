import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SignInResult {
  error: Error | null;
  needsMFASetup?: boolean;
  needsMFAVerify?: boolean;
}

interface MFAStatus {
  needsSetup: boolean;
  needsVerify: boolean;
}

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

  // Admin / Casting login (senha + MFA)
  signIn: (email: string, password: string) => Promise<SignInResult>;

  // Recreador – magic link
  signInRecreadorMagic: (email: string) => Promise<void>;

  // Fluxo de reset de senha (opcional para admin/casting)
  sendPasswordReset: (email: string, redirectPath?: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;

  signOut: () => Promise<void>;
  checkMFAStatus: () => Promise<MFAStatus>;
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
      const [adminRes, castingRes, recreadorRes] = await Promise.all([
        supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
        supabase.rpc("has_role", { _user_id: userId, _role: "casting" }),
        supabase.rpc("has_role", { _user_id: userId, _role: "recreador" }),
      ]);

      const isAdminUser = adminRes.data === true;
      const isCastingUser = castingRes.data === true;
      const isRecreadorUser = recreadorRes.data === true;

      let profId: string | null = null;
      if (isRecreadorUser) {
        const { data } = await supabase
          .from("profissional_auth")
          .select("profissional_id")
          .eq("user_id", userId)
          .single();
        profId = data?.profissional_id ?? null;
      }

      return {
        isAdmin: isAdminUser,
        isCasting: isCastingUser,
        isRecreador: isRecreadorUser,
        profissionalId: profId,
      };
    } catch (err) {
      console.error("Error checking user roles:", err);
      return {
        isAdmin: false,
        isCasting: false,
        isRecreador: false,
        profissionalId: null,
      };
    }
  };

  const checkMFAStatus = async (): Promise<MFAStatus> => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) return { needsSetup: false, needsVerify: false };

      const roles = await checkUserRoles(currentUser.id);
      const requiresMFA = roles.isAdmin || roles.isCasting;

      if (!requiresMFA) {
        setNeedsMFA(false);
        setMfaVerified(true);
        return { needsSetup: false, needsVerify: false };
      }

      setNeedsMFA(true);

      const { data: factors } = await supabase.auth.mfa.listFactors();
      const hasVerifiedTOTP =
        factors?.totp?.some((f) => f.status === "verified") || false;

      if (!hasVerifiedTOTP) {
        setMfaVerified(false);
        return { needsSetup: true, needsVerify: false };
      }

      const { data: aalData } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aalData) {
        setCurrentAAL(aalData.currentLevel);
      }

      if (aalData?.currentLevel === "aal2") {
        setMfaVerified(true);
        return { needsSetup: false, needsVerify: false };
      }

      setMfaVerified(false);
      return { needsSetup: false, needsVerify: true };
    } catch (err) {
      console.error("Error checking MFA status:", err);
      return { needsSetup: false, needsVerify: false };
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const roles = await checkUserRoles(newSession.user.id);
        setIsAdmin(roles.isAdmin);
        setIsCasting(roles.isCasting);
        setIsRecreador(roles.isRecreador);
        setProfissionalId(roles.profissionalId);

        await checkMFAStatus();
        setIsLoading(false);
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
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const roles = await checkUserRoles(session.user.id);
        setIsAdmin(roles.isAdmin);
        setIsCasting(roles.isCasting);
        setIsRecreador(roles.isRecreador);
        setProfissionalId(roles.profissionalId);

        await checkMFAStatus();
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login por senha (admin/casting; recreador também pode usar se quiser)
  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    if (data.user) {
      const mfaStatus = await checkMFAStatus();
      return {
        error: null,
        needsMFASetup: mfaStatus.needsSetup,
        needsMFAVerify: mfaStatus.needsVerify,
      };
    }

    return { error: null };
  };

  // Login recreador por magic link (Supabase OTP)
  const signInRecreadorMagic = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/recreador/auth-callback`,
      },
    });
    if (error) throw error;
  };

  // Enviar link de reset de senha (admin/casting/recreador se permitido)
  const sendPasswordReset = async (
    email: string,
    redirectPath: string = "/redefinir-senha"
  ) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${redirectPath}`,
    });
    if (error) throw error;
  };

  // Atualizar senha após o usuário abrir o link de reset
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsCasting(false);
    setIsRecreador(false);
    setProfissionalId(null);
    setNeedsMFA(false);
    setMfaVerified(false);
    setCurrentAAL(null);
  };

  return (
    <AuthContext.Provider
      value={{
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
        signInRecreadorMagic,
        sendPasswordReset,
        updatePassword,
        signOut,
        checkMFAStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

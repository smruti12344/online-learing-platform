import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useLoginUserMutation, useRegisterUserMutation } from "../api/authApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    googleId: "", // To store Google ID
  });
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
    googleToken: "", // To store Google ID
  });

  const [loading, setLoading] = useState(false);
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();
 const navigate = useNavigate();
  // Handle Input Changes
  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate Input Fields
  const validateInput = (type) => {
    const data = type === "signup" ? signupInput : loginInput;

    if (!data.email || !data.password) {
      alert("Email and Password are required.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (data.password.length < 6) {
      alert("Password should be at least 6 characters long.");
      return false;
    }

    if (type === "signup" && !data.name) {
      alert("Name is required for signup.");
      return false;
    }

    return true;
  };

  // Handle Registration or Login
  const handleRegistration = async (type) => {
    if (!validateInput(type)) return;
    const userData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(userData);
    // Add logic for signup/login with your backend here
  };

  // Handle Google sign-up and Login
  const handleGoogleAuth = async (type) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userGoogleData = {
        name: user.displayName || "",
        email: user.email || "",
        googleId: user.uid,
        token: await user.getIdToken(),
        profileImage: user.photoURL || "",
      };
  
      await (type === "signup" ? registerUser(userGoogleData) : loginUser(userGoogleData));
      toast.success(`${type === "signup" ? "Signup" : "Login"} Successful!`);
    } 
    catch (error) {
      console.error(`${type === "signup" ? "Signup" : "Login"} Error:`, error.message);
      toast.error(`${type === "signup" ? "Google Signup" : "Google Login"} Failed.`);
    } finally {
      setLoading(false);
    }
  }
  

  // Monitor Authentication State
  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup Successfull.");
    }
    if (registerError) {
      toast.error(registerError.data.message || "Signup faild")
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData?.message || "Login Successfull.");
      navigate('/');
    }
    if (loginError) {
      toast.error(loginError.data.message || "Signup faild")
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);

  return (
    <div className="flex justify-center items-center m-5">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Create a new account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  type="text"
                  value={signupInput.name}
                  placeholder="Enter your name"
                  onChange={(e) => changeInputHandler(e, "signup")}
                  required={true}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={signupInput.email}
                  placeholder="Enter Email"
                  onChange={(e) => changeInputHandler(e, "signup")}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  type="password"
                  value={signupInput.password}
                  placeholder="Enter Password"
                  onChange={(e) => changeInputHandler(e, "signup")}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button
                onClick={() => handleRegistration("signup")}
                disabled={registerIsLoading}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={(e) => handleGoogleAuth("signup")}
                disabled={registerIsLoading}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <>
                    <FaGoogle /> <span>Signup with Google</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={loginInput.email}
                  placeholder="Enter Email"
                  onChange={(e) => changeInputHandler(e, "login")}
                  required={true}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  type="password"
                  value={loginInput.password}
                  placeholder="Enter Password"
                  onChange={(e) => changeInputHandler(e, "login")}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button
                onClick={() => handleRegistration("login")}
                disabled={loginIsLoading}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={(e) => handleGoogleAuth("login")}
                disabled={loginIsLoading}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <>
                    <FaGoogle /> <span>Login with Google</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginPage;

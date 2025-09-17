import { SnakeAnimatedBackground } from "../../components/CustomAnimation";
import SignupPage from "./Signup";


const SignUpPageUI = () => {
  return (
    <div className="min-h-screen">
      <SnakeAnimatedBackground intensity="medium" theme="gray" style="modern" />
      <div className="z-10 flex items-center justify-center min-h-screen">
        <div className="py-10 mx-auto md:py-20">
          <SignupPage />
        </div>
      </div>
    </div>
  );
};

export default SignUpPageUI;

import { SnakeAnimatedBackground } from "../../components/CustomAnimation";
import LoginPage from "./Login";


const LoginPageUI = () => {
  return (
    <div className="relative min-h-screen">
      <SnakeAnimatedBackground intensity="medium" theme="gray" style="modern" />
      <div className="relative z-10 flex items-center justify-center min-w-lg min-h-screen">
        <div className="py-10  md:py-20 px-4">
          <LoginPage />
        </div>
      </div>
    </div>
  );
};

export default LoginPageUI
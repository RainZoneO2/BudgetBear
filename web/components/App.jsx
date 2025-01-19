import {
  SignedInOrRedirect,
  SignedOut,
  SignedOutOrRedirect,
  Provider,
} from "@gadgetinc/react";
import { Suspense, useEffect } from "react";
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate,
  Link,
} from "react-router-dom";
import { api } from "../api";
import Index from "../routes/index";
import SignedInPage from "../routes/signed-in";
import SignInPage from "../routes/sign-in";
import SignUpPage from "../routes/sign-up";
import ResetPasswordPage from "../routes/reset-password";
import VerifyEmailPage from "../routes/verify-email";
import ChangePassword from "../routes/change-password";
import ForgotPassword from "../routes/forgot-password";
import Reflection from "../routes/reflection";
import Settings from "../routes/settings"
import CameraPreview from "../routes/add"
import Home from "../routes/home"
import Menu from "../components/Menu"
import Budget from '../components/Budget'


const App = () => {
  useEffect(() => {
    document.title = `Home - Budget Bear`;
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <SignedOutOrRedirect>
              <Index />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="home"
          element={
            <SignedInOrRedirect>
              <Home />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="budget"
          element={
            <SignedInOrRedirect>
              <Budget />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="add"
          element={
            <SignedInOrRedirect>
              <CameraPreview />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="reflection"
          element={
            <SignedInOrRedirect>
              <Reflection />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="settings"
          element={
            <SignedInOrRedirect>
              <Settings />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="signed-in"
          element={
            <SignedInOrRedirect>
              <SignedInPage />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="change-password"
          element={
            <SignedInOrRedirect>
              <ChangePassword />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="forgot-password"
          element={
            <SignedOutOrRedirect>
              <ForgotPassword />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-in"
          element={
            <SignedOutOrRedirect>
              <SignInPage />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-up"
          element={
            <SignedOutOrRedirect>
              <SignUpPage />
            </SignedOutOrRedirect>
          }
        />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
      </Route>
    )
  );

  return (
    <Suspense fallback={<></>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

const Layout = () => {
  const navigate = useNavigate();

  return (
    <Provider
      api={api}
      navigate={navigate}
      auth={window.gadgetConfig.authentication}
    >
      <Header />
      <div className="w-screen h-[calc(100vh-80px)] left-0 top-20 z-0 bg-grid">
        <div className="text-center items-center justify-center flex w-screen h-full bg-gradient-radial-custom">
          <div className="min-w-[372px] flex font-[system-ui] items-center flex-col gap-4 max-h-full">
            <Outlet />
          </div>
        </div>
      </div>
      <Menu />
    </Provider>
  );
};

const Header = () => {
  return (
    <div className="flex bg-[white] w-full h-20 py-[21px] pl-[50px] pr-[49px] justify-between items-center font-[system-ui] z-[1] relative text-sm">
      <a href="/" target="_self" rel="noreferrer" className="no-underline">
        <div className="flex items-center text-black text-[24px] leading-[30px] font-semibold">
          <img src="https://cdn.discordapp.com/attachments/1330214164848705596/1330422019568832552/budgetbear_icon.PNG?ex=678deb8f&is=678c9a0f&hm=268c79d10c98fc061875d2c5c0904412584d4d056ef7a5ef62fdb472d54a62b5&" alt="icon" className="w-6 h-6 mr-2" />
          BudgetBear
        </div>
      </a>
      <div className="flex items-center gap-4">
        <SignedOut>
          <Link to="/sign-in" style={{ color: "black" }}>
            Sign in
          </Link>
          <Link to="/budget" style={{ color: "black" }}>
            Budget
          </Link>
          <Link to="/sign-up" style={{ color: "black" }}>
            Sign up
          </Link>
        </SignedOut>
      </div>
    </div>
  );
};

export default App;

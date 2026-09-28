import AppRoutes from "./routes/AppRoutes.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { DashboardProvider } from "./context/DashboardContext.jsx";
import { CategoriesProvider } from "./context/CategoriesContext.jsx";
import { UsersProvider } from "./context/UsersContext.jsx";
import ThemeProvider from "./context/ThemeProvider.jsx";
import { IssuesProvider } from "./context/IssuesContext.jsx";
import { ReporterProvider } from "./context/ReporterContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DashboardProvider>
          <CategoriesProvider>
            <UsersProvider>
              <IssuesProvider>
                <ReporterProvider>
                  <AppRoutes />
                </ReporterProvider>
              </IssuesProvider>
            </UsersProvider>
          </CategoriesProvider>
        </DashboardProvider>
      </AuthProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </ThemeProvider>
  );
};

export default App;
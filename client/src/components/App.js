import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import NotFound from "./NotFound";
import Signin from "./Signin";
import Signup from "./Signup";
import "./App.css";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";

function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <UserRoute exact path="/user/dashboard" component={UserDashboard} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />

        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;

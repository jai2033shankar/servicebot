import React from 'react';
import {render} from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import Promise from "promise-polyfill";
import {setOptions,setUid, setUser, fetchUsers, initializeState} from "./components/utilities/actions"
import { store, initializedState } from "./store"
import { Provider } from 'react-redux'
import cookie from 'react-cookie';
// App
import App from "./components/app.jsx";
import Home from "./components/pages/home.jsx";
import AllServices from "./components/pages/all-services.jsx";
// Dashboard (My Services)
import MyServices from './components/pages/my-services.jsx';
import ModalInvoice from './components/elements/modals/modal-invoice.jsx';
import ServiceInstance from './components/pages/service-instance.jsx';
import ServiceRequest from './components/pages/service-catalog-request.jsx';
import ServiceCatalog from './components/pages/service-catalog.jsx';
// User
import { Notifications } from "./components/pages/notifications.jsx"
import Users from './components/pages/users.jsx';
import Login from "./components/elements/forms/login.jsx";
import ForgotPassword from "./components/elements/forms/forgot-password.jsx";
import ResetPassword from "./components/elements/forms/reset-password.jsx";
import SignUp from "./components/pages/signup.jsx";
import UserForm from "./components/pages/account-settings.jsx";
import Profile from "./components/pages/profile.jsx";
// Billings
import BillingHistory from "./components/pages/billing-history.jsx";
import BillingInvoice from "./components/pages/billing-invoice.jsx";
import BillingSettings from "./components/pages/billing-settings.jsx";
// Admin
import Dashboard from "./components/pages/dashboard.jsx";
import SystemSettings from "./components/pages/system-settings.jsx";
import StripeSettings from "./components/pages/stripe-settings.jsx";
import ManageUsers from "./components/pages/manage-users.jsx";
import ManageSubscriptions from "./components/pages/manage-subscriptions.jsx";
import ManagePermission from "./components/pages/manage-permission.jsx";
import ManageCatalog from "./components/pages/manage-catalog.jsx";
import ManageCatalogList from "./components/pages/manage-catalog-list.jsx";
import ManageCatalogCreate from "./components/pages/manage-catalog-create.jsx";
import ManageCatalogEdit from "./components/pages/manage-catalog-edit.jsx";
import UserEdit from "./components/pages/user-edit.jsx";
import ManageCategories from "./components/pages/manage-categories.jsx";
import ManageNotificationTemplates from "./components/pages/manage-notification-templates.jsx";
// Elements
import NotificationTemplateForm from "./components/elements/forms/notification-template-form.jsx";
import ServiceTemplateForm from "./components/elements/forms/service-template-form-review.jsx";
import ServiceInstanceForm from "./components/elements/forms/service-instance-form-example.jsx";
import Embed from "./components/elements/embed.jsx";
import Setup from "./components/pages/setup.jsx";
import GenericNotFound from "./components/pages/notfound.jsx";
//Tests
import ServiceRequestFormV2 from "./components/elements/forms/service-instance-form-request-v2.jsx";
import _ from "lodash";
let plugins = store.getState().plugins;

let routes = _.reduce(plugins, (pluginRoutes, plugin) => {
    return pluginRoutes.concat(plugin.routes)
}, []);

store.dispatch(initializedState);

let AppRouter = function(props) {

    return (
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route name="Home" path="/" component={App}>
                    <IndexRoute component={Home}/>
                    <Route path="test" component={ServiceRequestFormV2}/>
                    {/*<Route path="test2" component={FormTest}/>*/}
                    <Route name="Home" path="home" component={Home}/>
                    <Route name="All Services" path="all-services" component={AllServices}/>
                    <Route name="User Login" path="login" component={Login}/>
                    <Route name="Forgot Password" path="forgot-password" component={ForgotPassword}/>
                    <Route name="Reset Password" path="reset-password/:uid/:token" component={ResetPassword}/>
                    <Route name="User Sign Up" path="signup" component={SignUp}/>
                    <Route name="Finish Your Registration" path="invitation/:token" component={SignUp}/>
                    <Route name="My Services" path="my-services" component={MyServices}/>
                    <Route name="My Services" path="my-services/service-instance/" component={MyServices}/>
                    <Route name="Service Instance" path="my-services/service-instance/:instanceId"
                           component={ServiceInstance}/>
                    <Route name="Service Instance" path="service-instance/:instanceId" component={ServiceInstance}/>
                    <Route name="Service Catalog" path="service-catalog" component={ServiceCatalog}/>
                    <Route name="Service Request" path="service-catalog/:templateId/request" component={ServiceRequest}/>
                    <Route name="Account Settings" path="account-settings/:userId" component={UserForm}/>
                    <Route name="My Profile" path="profile" component={Profile}/>
                    {/* Billing */}
                    <Route name="Billing History" path="billing-history" component={BillingHistory}/>
                    <Route name="Billing History" path="billing-history/:uid" component={BillingHistory}/>
                    <Route name="Billing History" path="billing-history/invoice/:invoiceId" component={BillingInvoice}/>
                    <Route name="Invoice" path="invoice/:invoiceId" component={BillingInvoice}/>
                    <Route name="Billing Settings" path="billing-settings" component={BillingSettings}/>
                    <Route name="Billing Settings" path="billing-settings/:userId" component={BillingSettings}/>
                    {/* Admin */}
                    <Route name="Dashboard" path="dashboard" component={Dashboard}/>
                    <Route name="Notifications" path="notifications" component={Notifications}/>
                    <Route name="System Settings" path="system-settings" component={SystemSettings}/>
                    <Route name="Stripe Settings" path="stripe-settings" component={StripeSettings}/>
                    <Route name="Manage Users" path="manage-users" component={ManageUsers}/>
                    <Route name="Edit User" path="manage-users/:userId" components={UserEdit}/>
                    <Route name="Manage Subscriptions" path="manage-subscriptions" component={ManageSubscriptions}/>
                    <Route name="Manage Categories" path="manage-categories" component={ManageCategories}/>
                    <Route name="Manage Permission" path="manage-permission" component={ManagePermission}/>
                    <Route name="Manage Notification Templates" path="notification-templates" components={ManageNotificationTemplates}/>
                    <Route name="Notification Template" path="notification-templates/:id" component={NotificationTemplateForm}/>
                    <Route name="Manage Catalog" path="manage-catalog" component={ManageCatalog}>
                        <IndexRoute component={ManageCatalogList}/>
                        <Route name="Manage Catalog" path="list" component={ManageCatalogList}/>
                        <Route name="Create Template" path="create" component={ManageCatalogCreate}/>
                        <Route name="Edit Template" path=":templateId" component={ManageCatalogEdit}/>
                        <Route name="Edit Template" path=":templateId/edit" component={ManageCatalogEdit}/>
                    </Route>
                    {/* Query routes */}
                    <Route name="Services" path="manage-subscriptions/:status" component={ManageSubscriptions}/>
                    {/* Other */}
                    <Route path="users" component={Users}/>
                    <Route path="service-templates/:templateId" component={ServiceTemplateForm}/>
                    <Route name="Manage Subscriptions" path="/service-instance" component={ManageSubscriptions}/>
                    <Route path="service-instances/:instanceId" component={ServiceInstanceForm}/>
                    {routes}
                </Route>
                <Route name="Embed" path={"/service/:serviceId/embed"} component={Embed}/>
                <Route name="Automated Installation" path="setup" component={Setup}/>
                <Route path='*' component={GenericNotFound}/>
            </Router>
        </Provider>
    );
}
export default AppRouter;

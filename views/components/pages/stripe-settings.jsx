import React from 'react';
import {Link, hashHistory, browserHistory} from 'react-router';
import {Authorizer, isAuthorized} from "../utilities/authorizer.jsx";
import Jumbotron from "../layouts/jumbotron.jsx";
import Content from "../layouts/content.jsx";
import StripeSettingsForm from "../elements/forms/stripe-settings-form.jsx";
import StripeImportForm from "../elements/forms/stripe-import-form.jsx";

class StripeSettings extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        if(!isAuthorized({permissions:"can_administrate"})){
            return browserHistory.push("/login");
        }

    }


    render () {
        var self = this;
        let pageName = this.props.route.name;
        let breadcrumbs = [{name:'Home', link:'home'},{name:'My Services', link:'/my-services'},{name:pageName, link:null}];
        return(
            <Authorizer permissions="can_administrate">
                <Jumbotron pageName={pageName} location={this.props.location}/>
                <div className="page-service-instance">
                    <Content>
                        <div className="row m-b-20">
                            <StripeSettingsForm/>
                        </div>
                        <hr/>
                        <div className="row m-b-20">
                            <StripeImportForm/>
                        </div>
                    </Content>
                </div>
            </Authorizer>
        );
    }
}

export default StripeSettings;

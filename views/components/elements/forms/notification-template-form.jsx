
import React from 'react';
import Load from '../../utilities/load.jsx';
import Fetcher from "../../utilities/fetcher.jsx"
import {Authorizer} from "../../utilities/authorizer.jsx";
import Jumbotron from "../../layouts/jumbotron.jsx";
import Content from "../../layouts/content.jsx";
import {DataForm, DataChild, DataInput} from "../../utilities/data-form.jsx";
import {Wysiwyg, WysiwygTemplater} from "../wysiwyg.jsx";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

class NotificationTemplateForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            template : {},
            url : "/api/v1/notification-templates/" + props.params.id,
            roleUrl : "/api/v1/roles",
            roles : []
        };

        this.handleFiles = this.handleFiles.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleRole = this.handleRole.bind(this);
        this.insertString = this.insertString.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData(){
        let self = this;
        Fetcher(self.state.url).then(function(response){
            if(!response.error){

                console.log(response);
                return response;
            }
//then get the roles
        }).then(function(r){
            if(r){
                Fetcher(self.state.url + "/roles").then(function(roles){
                    if(!roles.error) {
                        Fetcher(self.state.roleUrl).then(function(allRoles){
                            let roleIds = roles.map(role => role.data.id);
                            self.setState({loading: false, template: r, templateRoles: roles, allRoles:allRoles, roles: roleIds});
                        })
                    }

                })
            }
        });


        }
    handleRole(id){
        let self = this;
        return function(e) {
            console.log("HELLO!");
            const target = e.target;
            if (target.checked) {
                if (!self.state.roles.includes(id)){
                    self.setState({roles: self.state.roles.concat(id)})
                }
            }else{
                self.setState({roles: self.state.roles.filter(role => role != id)})
            }

    }}
    handleFiles(e){
        e.preventDefault();
        // console.log($(".yo"));
        // $('#content').redactor({
        //     focus: true
        // });

        // let self = this;
        // let url = this.state.url;
        // self.handleImage(url + "/image", "template-image-form").then(function(result){
        //     console.log(result);
        //     self.handleImage(url + "/icon", "template-icon-form").then(function(result2){
        //         console.log(result2);
        //         self.forceUpdate();
        //     })
        // });

    }
    handleResponse(response){
        Fetcher(this.state.url + "/roles", "PUT", this.state.roles).then(function(response2){
            console.log(response2)
        })
        console.log(response);

    }

    handleImage(url, id){
        console.log("HELLO!");
        var self = this;



    }


    insertString(html) {
        let self = this;
        return function (e){
            e.preventDefault();
            console.log('ref templater', self.refs);
            self.refs.wysiwygTemplater.refs.wysiwyg.insert(html);
        }
    }

    humanString(text){
        return(text.replace(/_/g, ' '));
    }

    render() {

        if(this.state.loading) {
            return <Load/>;
        }else{
            console.log('the notification template',this.state.template);
            let pageName = this.state.template.data.name || this.props.route.name;
            let template = this.state.template;
            let roles = this.state.templateRoles;
            let allRoles = this.state.allRoles;
            let references = template.schema.references;

            return(
                <div>
                    <Authorizer permissions={["can_administrate", "can_manage"]}>
                        <Jumbotron pageName={pageName} location={this.props.location}/>
                        <div className="page-service-instance">
                            <Content>
                                <div className="row m-b-20">
                                    <div className="col-sm-8 col-md-9">
                                        <div className="service-instance-section">
                                            <span className="service-instance-section-label"><strong>Editing Notification Template</strong></span>
                                            <h4>{template.data.name}</h4>
                                        </div>
                                        <div className="service-instance-section">
                                            <span className="service-instance-section-label"><strong>Select the roles you want this email to be sent to</strong></span>
                                            <span className="help-block">The notification will be sent to all users with the roles.</span>
                                        {allRoles.map(role => {
                                            console.log(role);
                                            console.log(roles);

                                            let checked = roles.some(function(checkedRole){
                                                return role.id == checkedRole.data.id
                                            });
                                            console.log(checked);


                                            return (
                                                <div key={role.id}>
                                                    <input onChange={this.handleRole(role.id)} type="checkbox" defaultChecked={checked}/>
                                                    <span> {role.role_name}</span>
                                                    <span>{role.role_name == "user" && " - email will be sent to all users"}</span>
                                                </div>
                                            )
                                        })}
                                        </div>
                                        <DataForm handleResponse={this.handleResponse} url={this.state.url} method="PUT">
                                            <div className="service-instance-section notification-settings-section">
                                                <span className="service-instance-section-label"><strong>Notification Settings</strong></span>

                                                <input name="create_notification" type="checkbox" defaultChecked={template.data.create_notification}/> <span>Create Notification</span><br/>
                                                <input name="send_email" type="checkbox" defaultChecked={template.data.send_email}/> <span className="inline"> Send Email</span><br/>
                                                <input name="send_to_owner" type="checkbox" defaultChecked={template.data.send_to_owner}/> <span className="inline"> Send Email To Owner</span>
                                            </div>
                                            <div className="service-instance-section">
                                                <span className="service-instance-section-label"><strong>Additional Recipients</strong></span>
                                                <span className="help-block">Add recipients directly, these will be people who will also get this email notification for this event.</span>
                                                <TagsInput onChange={this.handleImage} name="additional_recipients" receiveOnChange={true} receiveValue={true} value={template.data.additional_recipients || []}/>
                                            </div>
                                            <div className="service-instance-section">
                                                <span className="service-instance-section-label"><strong>Subject</strong></span>
                                                <input type="text" name="subject" defaultValue={template.data.subject}/>
                                            </div>
                                            <div className="service-instance-section">
                                                <span className="service-instance-section-label"><strong>Body</strong></span>
                                                <WysiwygTemplater receiveValue={true} receiveOnChange={true} name="message" defaultValue={template.data.message} ref="wysiwygTemplater" schema={template.schema}/>
                                                <div className="p-t-15">
                                                    <button className="btn btn-md btn-info btn-rounded pull-right" type="submit" value="submit">Save Notification Template</button>
                                                    <div className="clearfix"/>
                                                </div>
                                            </div>
                                        </DataForm>
                                    </div>
                                    <div className="col-sm-4 col-md-3">
                                        <div className="service-instance-section">
                                            <span className="service-instance-section-label"><strong>Data Fields</strong></span>
                                            <span className="help-block">Available data fields, you can insert data fields related to this event ({this.humanString(template.data.name)}) into the body of your notification.</span>
                                            <ul className = "templateList">
                                                <span className="help-block text-capitalize">{this.humanString(template.data.name)} Fields</span>
                                                {Object.keys(template.schema).map(field => {
                                                    if(field == "references"){
                                                        return Object.keys(references).map(reference => {
                                                            return (
                                                                <ul key={reference} className="referenceList list-group">
                                                                    <span className="help-block text-capitalize">{this.humanString(reference)} Fields</span>
                                                                    {Object.keys(references[reference]).map(referenceColumn => {
                                                                        return (
                                                                        <li key={referenceColumn} className="column reference-column list-unstyled">
                                                                            <button className="btn btn-sm btn-info" onClick={this.insertString(`[[references.${reference}.${referenceColumn}]]`)}>{referenceColumn}</button>
                                                                        </li>)
                                                                    })}
                                                                </ul>
                                                            )
                                                        })
                                                    }else{
                                                        return (
                                                            <div>
                                                                <li key={field} className="column list-unstyled">
                                                                    <button className="btn btn-sm btn-info" onClick={this.insertString(`[[${field}]]`)}>{field}</button>
                                                                </li>
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </Content>
                        </div>
                    </Authorizer>
                </div>);
        }
    }

}

export default NotificationTemplateForm

import React from 'react';
import Load from '../../utilities/load.jsx';
import {browserHistory} from 'react-router';
import cookie from 'react-cookie';
import Fetcher from "../../utilities/fetcher.jsx";
import Modal from '../../utilities/modal.jsx';
import DateFormat from '../../utilities/date-format.jsx';
import {Price} from '../../utilities/price.jsx';
import { connect } from "react-redux";
let _ = require("lodash");

class ModalInvoice extends React.Component {

    constructor(props){
        super(props);
        let uid = cookie.load("uid");
        let username = cookie.load("username");
        this.state = {  loading: true,
            nextInvoice : false,
            currentUser: false,
            url: `/api/v1/invoices/upcoming/${uid}`,
            uid: uid,
            email: username,
        };
        console.log("Modal Invoice Loaded");
        this.fetchNextInvoice = this.fetchNextInvoice.bind(this);
    }

    componentDidMount() {
        this.fetchNextInvoice();
    }

    fetchNextInvoice(){
        let self = this;
        Fetcher(self.state.url).then(function(response){
            console.log("modal invoice response:", response);
            if(response != null){
                console.log("modal invoice response is not null");
                if(!response.error){
                    console.log("modal invoice response has no error", response);
                    self.setState({nextInvoice : response});
                    return response
                }
            }
        }).then(function (data) {
            console.log('data');
            Fetcher(`/api/v1/users/own`).then(function (response) {
               if(response != null && !response.error){
                   console.log("got user object", response)
                   self.setState({loading: false, currentUser: response[0]});
               }else{
                   self.setState({loading: false});
               }
            });
            self.setState({loading:false});
        });
    }

    handleUnauthorized(){
        browserHistory.push("/login");
    }

    render () {
        let self = this;
        let pageName = "Upcoming Invoice";

        if(self.state.loading){
            return(
                <Load/>
            );
        }else{
            let myNextInvoice = self.state.nextInvoice;
            if(myNextInvoice){
                let amountDue = myNextInvoice.amount_due || 0;
                let total = myNextInvoice.total || 0;
                let nextPaymentAttempt = myNextInvoice.next_payment_attempt || '';
                let closed = myNextInvoice.closed || false;
                let paid = myNextInvoice.paid || false;

                let lineItemCount = myNextInvoice.lines.total_count || 0;
                let lineItems = myNextInvoice.lines.data; //data is an array of objects

                let item_name = (item)=>{
                    if(item.description) {
                        return item.description;
                    } else if (item.plan) {
                        return item.plan.name;
                    } else {
                        return item.type;
                    }
                };

                let items = ()=>{
                    return(
                        lineItems.map((item)=>
                            <tr key={item.id}>
                                <td>{item_name(item)}</td>
                                <td><DateFormat date={nextPaymentAttempt}/></td>
                                <td><Price value={item.amount}/></td>
                            </tr>
                        )
                    );
                };

                let last4 = null;
                let fund = self.state.currentUser.references.funds;
                if(fund && fund.length > 0){
                    last4 = fund[0].source.card.last4;
                }

                let modalHeadingStyle = {};
                if(this.props.options){
                    let options = this.props.options;
                    modalHeadingStyle.backgroundColor = _.get(options, 'primary_theme_background_color.value', '#000000');
                }

                return(
                    <Modal modalTitle={pageName} show={this.props.show} hide={this.props.hide}>
                        <div id="invoice-modal" className="table-responsive">
                            <div className="invoice-widget" style={modalHeadingStyle}>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-4">
                                        <div className="address">
                                            <strong>Amount To Be Charged</strong><br/>
                                            <span><i className="fa fa-money"/><Price value={amountDue}/></span><br/>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-4">
                                        <div className="address">
                                            <strong>Charge Date</strong><br/>
                                            <span><i className="fa fa-calendar-o"/><DateFormat date={nextPaymentAttempt}/></span><br/>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-4">
                                        <div className="payment-method">
                                            <strong>Using Payment Method</strong><br/>
                                            <span><i className="fa fa-credit-card"/>*** *** *** {last4}</span><br/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table id="invoice-table" className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <td className="service-description"><strong>Service Item</strong></td>
                                        <td className="service-billing-date"><strong>Payment Date</strong></td>
                                        <td className="service-price"><strong>Amount</strong></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items()}
                                </tbody>
                                <tfoot className="invoice-footer">
                                    <tr>
                                        <td/>
                                        <td>Total:</td>
                                        <td><Price value={total}/></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </Modal>
                );
            }else{
                return(
                    <Modal modalTitle={pageName} show={this.props.show} hide={this.props.hide}>
                        <div className="table-responsive">
                            <div className="invoice-widget">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <p>You do not have any invoice at the moment.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                );
            }

        }
    }
}

export default connect((state) => {return {options:state.options}})(ModalInvoice);
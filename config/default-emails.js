let default_notifications = {};
default_notifications.templates = [
    {name:"request_service_instance_admin",
        event_name:"service_instance_requested_for_user",
        message:"Hello [[references.users.name]],\r\nYour service [[name]] has been requested for you. Please login to your account and approve the <a href='[[_hostname]]/my-services'>service</a>. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Instance needs approval",
        model:"service-instance",
        send_email:true
    },
    {name:"request_service_instance_user",
        event_name:"service_instance_requested_by_user",
        message:"Hello [[references.users.name]], \r\nYour service request for [[name]] has been completed. Please login to your account to view and access your <a href='[[_hostname]]/service-instance/[[id]]'>service</a>. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Instance requested",
        model:"service-instance",
        send_email:true
    },
    {name:"request_service_instance_new_user",
        event_name:"service_instance_requested_new_user",
        message:"Hello [[references.users.name]], \r\nYour service request for [[name]] has been completed. Please click the link to complete user <a href='[[url]]'>registration</a> in order to view your services. Once registered you can access your <a href='[[_hostname]]/service-instance/[[id]]'>service</a>. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Instance requested",
        model:"service-instance",
        send_email:true
    },
    {name:"service_requires_payment_approval",
        event_name:"service_instance_charge_added",
        message:"Hello [[references.users.name]], \r\nThere are additional charges added to your service, [[name]]. Please login to your account and approve the <a href='[[_hostname]]/my-services'>charges</a>. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Instance has additional charges",
        model:"service-instance",
        send_email:true
    },
    {name:"service_cancellation_submitted",
        event_name:"service_instance_cancellation_requested",
        message:"Hello [[references.users.name]], \r\nYour cancellation request for [[name]] has been submitted. You will receive another notification when it has been approved. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Instance cancellation submitted",
        model:"service-instance",
        send_email:true
    },
    {name:"service_instance_update",
        event_name:"service_instance_updated",
        message:"Hello [[references.users.name]], \r\nYour Service Instance [[name]] has been updated. You can use this link to view your <a href='[[_hostname]]/service-instance/[[id]]'>instance details</a>. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Instance updated",
        model:"service-instance",
        send_email:true
    },
    {name:"instance_cancellation_approved",
        event_name:"service_instance_cancellation_approved",
        message:"Hello, \r\nYour cancellation request has been approved. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Instance cancellation request approved",
        model:"service-instance-cancellation",
        send_email:true
    },
    {name:"instance_cancellation_rejected",
        event_name:"service_instance_cancellation_rejected",
        message:"Hello, \r\nYour cancellation request for has been rejected. For more information, contact your service provider or comment on your <a href='[[_hostname]]/service-instance/[[service_instance_id]]'>service</a> and we will get back to you shortly. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Instance cancellation request rejected",
        model:"service-instance-cancellation",
        send_email:true
    },
    {name:"password_reset",
        event_name:"password_reset_request_created",
        message:"Hello [[name]], \r\nFollow the following link to <a href='[[url]]'>reset your password</a>. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot password reset",
        model:"user",
        send_email:true
    },
    {name:"invitation",
        event_name:"user_invited",
        message:"Hello there, \r\nYou have been invited to use the [[_company_name]] ServiceBot System. From <a href='[[_hostname]]'>here</a> you can request new services, manage your services, and see other service options. Please click the link to begin user <a href='[[url]]'>registration</a>. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Invitation!",
        model:"user",
        send_email:true
    },
    {name:"registration_user",
        event_name:"user_registered",
        message:"Hello [[name]], \r\nYour registration has been completed! You can now access your account at <a href='[[_hostname]]'>here</a>. Thank you for choosing [[_company_name]]. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot registration complete",
        model:"user",
        send_email:true
    },
    {name:"registration_admin",
        event_name:"user_registered",
        message:"Hello ServiceBot Admin, \r\nYou have gained a new user! [[name]] - [[email]] has just joined your ServiceBot system. \r\nThank you, \r\n [[_company_name]]",
        subject:"New ServiceBot User",
        model:"user",
        send_email:true,
        send_to_owner:false
    },
    {name:"user_suspension",
        event_name:"user_suspended",
        message:"Hello [[name]], \r\nYour ServiceBot account has been suspended. Please contact your service provider and check the state of your <a href='[[_hostname]]/my-services'>account</a>. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Account Suspended",
        model:"user",
        send_email:true
    },
    {name:"user_deletion",
        event_name:"user_deleted",
        message:"Hello [[name]], \r\nYour ServiceBot account has been deleted. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Account Deleted",
        model:"user",
        send_email:true
    },
    {name:"payment_failure",
        event_name:"payment_failure",
        message:"Hello [[name]], \r\nYour payment failed. Please log into your account and check your <a href='[[_hostname]]/billing-settings'>payment plan</a>. \r\nThank you, \r\n [[_company_name]]",
        subject:"ServiceBot Payment Failure",
        model:"user",
        send_email:true
    }
];
//Setting the registration_admin role to admin
default_notifications.templates_to_roles = [
    {
        notification_template_id:12,
        role_id:1
    },
];
module.exports = default_notifications;
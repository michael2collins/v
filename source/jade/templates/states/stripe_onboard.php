<!DOCTYPE html>
<div ng-controller="StripeTableBasicController as vm">

    <div class="portlet box portlet-green">
        <div class="portlet-header">
                <div class="caption">Onboard with Stripe for Payments</div>
                <div class="tools"><i class="fa fa-chevron-up"></i></div>
        </div>
      <div class="portlet-body pbn ptl" style="display: block;   background-color: grey;">
            <div class="panel panel-blue">
                <div class="panel-heading">Stripe Registration</div>
                <div class="panel-body pan">
<p>                    
VDojo uses Stripe to get you paid quickly and keep your personal and payment information secure. 
Thousands of companies around the world trust Stripe to process payments for their users. 
Set up a Stripe account to get paid with VDojo.                    
</p>
client_id {{vm.client_id}}
<p>
<a href="https://connect.stripe.com/oauth/authorize?response_type=code&amp;client_id={{vm.client_id}}&amp;scope=read_write&amp;state={{vm.send_state}}" 
 class="stripe-connect"><span>Connect with Stripe</span></a>
</p>
</div>

                <div class="panel-footer" >

                </div>
            </div>
        </div>
    </div>
</div>
<?php

class PaypalIPN
{

    /**
     * @var bool $use_sandbox     Indicates if the sandbox endpoint is used.
     */
    private $use_sandbox = false;
    /**
     * @var bool $use_local_certs Indicates if the local certificates are used.
     */
    private $use_local_certs = true;

    private                    $payment_type ="";          
    private                     $payment_date ="";          
    private                    $payer_status ="";          
    private                    $first_name ="";          
    private                    $last_name ="";          
    private                    $payer_email ="";          
    private                    $address_name ="";          
    private                    $address_country ="";          
    private                    $address_country_code ="";          
    private                    $address_zip ="";          
    private                    $address_state ="";          
    private                    $address_city ="";          
    private                    $address_street ="";          
    private                     $payment_status ="";          
    private                    $mc_currency ="";          
    private                    $mc_gross_1 ="";          
    private                    $item_name1 ="";          
    private                    $txn_id ="";          
    private                    $reason_code ="";          
    private                    $parent_txn_id ="";          
    private                     $num_cart_items ="";
    private                     $quantity1 = "";
    private                     $quantity2 = "";
    private                     $quantity3 = "";
    private                     $quantity4 = "";
    private                     $quantity5 = "";
    private                    $item_name2 ="";          
    private                    $item_name3 ="";          
    private                    $item_name4 ="";          
    private                    $item_name5 ="";          
    private                    $mc_gross_2 ="";          
    private                    $mc_gross_3 ="";          
    private                    $mc_gross_4 ="";          
    private                    $mc_gross_5 ="";          
    private                     $receipt_id = "";
    private                     $payment_gross = "";
    private                     $ipn_track_id ="";
    private                     $custom ="";
    
    /** Production Postback URL */
    const VERIFY_URI = 'https://ipnpb.paypal.com/cgi-bin/webscr';
    /** Sandbox Postback URL */
    const SANDBOX_VERIFY_URI = 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr';


    /** Response from PayPal indicating validation was successful */
    const VALID = 'VERIFIED';
    /** Response from PayPal indicating validation failed */
    const INVALID = 'INVALID';


    /**
     * Sets the IPN verification to sandbox mode (for use when testing,
     * should not be enabled in production).
     * @return void
     */
    public function useSandbox()
    {
        $this->use_sandbox = true;
    }

    /**
     * Sets curl to use php curl's built in certs (may be required in some
     * environments).
     * @return void
     */
    public function usePHPCerts()
    {
        $this->use_local_certs = false;
    }


    /**
     * Determine endpoint to post the verification data to.
     * @return string
     */
    public function getPaypalUri()
    {
        if ($this->use_sandbox) {
            return self::SANDBOX_VERIFY_URI;
        } else {
            return self::VERIFY_URI;
        }
    }


    public function getOutput() {
        $vars = get_object_vars ( $this );
        $array = array ();
        foreach ( $vars as $key => $value ) {
            $array [ $key ] = $value;
        }
        return $array;
    }
    
    /**
     * Verification Function
     * Sends the incoming post data back to PayPal using the cURL library.
     *
     * @return bool
     * @throws Exception
     */
    public function verifyIPN()
    {
        if ( ! count($_POST)) {
            throw new Exception("Missing POST Data");
        }

        $raw_post_data = file_get_contents('php://input');
        $raw_post_array = explode('&', $raw_post_data);
        $myPost = array();
        foreach ($raw_post_array as $keyval) {
            $keyval = explode('=', $keyval);
            if (count($keyval) == 2) {
                // Since we do not want the plus in the datetime string to be encoded to a space, we manually encode it.
                if ($keyval[0] === 'payment_date') {
                    if (substr_count($keyval[1], '+') === 1) {
                        $keyval[1] = str_replace('+', '%2B', $keyval[1]);
                    }
                }
                $myPost[$keyval[0]] = urldecode($keyval[1]);
            }
        }

        // Build the body of the verification post request, adding the _notify-validate command.
        $req = 'cmd=_notify-validate';
        $get_magic_quotes_exists = false;
        if (function_exists('get_magic_quotes_gpc')) {
            $get_magic_quotes_exists = true;
        }
        foreach ($myPost as $key => $value) {
            if ($get_magic_quotes_exists == true && get_magic_quotes_gpc() == 1) {
                $value = urlencode(stripslashes($value));
            } else {
                $value = urlencode($value);
            }
            $req .= "&$key=$value";
        }

        // Post the data back to PayPal, using curl. Throw exceptions if errors occur.
        $ch = curl_init($this->getPaypalUri());
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
        curl_setopt($ch, CURLOPT_SSLVERSION, 6);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

        // This is often required if the server is missing a global cert bundle, or is using an outdated one.
        if ($this->use_local_certs) {
            curl_setopt($ch, CURLOPT_CAINFO, __DIR__ . "/cert/cacert.pem");
        }
        curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'User-Agent: PHP-IPN-Verification-Script',
            'Connection: Close',
        ));
        $res = curl_exec($ch);
        if ( ! ($res)) {
            $errno = curl_errno($ch);
            $errstr = curl_error($ch);
            curl_close($ch);
            throw new Exception("cURL error: [$errno] $errstr");
        }

        $info = curl_getinfo($ch);
        $http_code = $info['http_code'];
        if ($http_code != 200) {
            throw new Exception("PayPal responded with http code $http_code");
        }

        curl_close($ch);

        // Check if PayPal verifies the IPN data, and if so, return true.
        if ($res == self::VALID) {

              // The IPN is verified, process it:
              // check whether the payment_status is Completed
              // check that txn_id has not been previously processed
              // check that receiver_email is your Primary PayPal email
              // check that payment_amount/payment_currency are correct
              // process the notification
              // assign posted variables to local variables
//              $item_name = $_POST['item_name'];
 //             $item_number = $_POST['item_number'];
  //            $payment_status = $_POST['payment_status'];
//              $payment_amount = $_POST['mc_gross'];
 //             $payment_currency = $_POST['mc_currency'];
  //            $txn_id = $_POST['txn_id'];
//              $receiver_email = $_POST['receiver_email'];
 //             $payer_email = $_POST['payer_email'];
              // IPN message values depend upon the type of notification sent.
              // To loop through the &_POST array and print the NV pairs to the screen:
//              foreach($_POST as $key => $value) {
 //               error_log( print_R("verify each: " .  $key . " = " . $value . "\n", TRUE), 3, LOG);
  //            }
                    error_log( print_R("PIN good response to this request\n", TRUE), 3, LOG);
            
                foreach($myPost as $key => $value) {
                    error_log( print_R($key . " = " . $value .  "\n", TRUE), 3, LOG);

                    if ($key == "payment_type") {
                        $this->payment_type = $value;          
                    }
                    if ($key == "payment_date") {
                        $this->payment_date = $value;          
                    }
                    if ($key == "payment_status") {
                        $this->payer_status = $value;          
                    }
                    if ($key == "first_name") {
                        $this->first_name = $value;          
                    }
                    if ($key == "last_name") {
                        $this->last_name = $value;          
                    }
                    if ($key == "payer_email") {
                        $this->payer_email = $value;          
                    }
                    if ($key == "address_name") {
                        $this->address_name = $value;          
                    }
                    if ($key == "address_country") {
                        $this->address_country = $value;          
                    }                    
                    if ($key == "address_country_code") {
                        $this->address_country_code = $value;          
                    }
                    if ($key == "address_zip") {
                        $this->address_zip = $value;          
                    }
                    if ($key == "address_state") {
                        $this->address_state = $value;          
                    }
                    if ($key == "address_city") {
                        $this->address_city = $value;          
                    }
                    if ($key == "address_street") {
                        $this->address_street = $value;          
                    }
                    if ($key == "payment_status") {
                        $this->payment_status = $value;          
                    }          
                    if ($key == "mc_currency") {
                        $this->mc_currency = $value;          
                    }          
                    if ($key == "mc_gross_1") {
                        $this->mc_gross_1 = $value;          
                    }          
                    if ($key == "item_name1") {
                        $this->item_name1 = $value;          
                    }          
                    if ($key == "txn_id") {
                        $this->txn_id = $value;          
                    }          
                    //useful for refund
                    if ($key == "reason_code") {
                        $this->reason_code = $value;          
                    }          
                    if ($key == "parent_txn_id") {
                        $this->parent_txn_id = $value;          
                    }          
                    if ($key == "num_cart_items") {
                        $this->num_cart_items = $value;          
                    }          
                    if ($key == "ipn_track_id") {
                        $this->ipn_track_id = $value;          
                    }          
                    if ($key == "receipt_id") {
                        $this->receipt_id = $value;          
                    }          
                    if ($key == "payment_gross") {
                        $this->payment_gross = $value;          
                    }          
                    if ($key == "mc_gross_2") {
                        $this->mc_gross_2 = $value;          
                    }          
                    if ($key == "mc_gross_3") {
                        $this->mc_gross_3 = $value;          
                    }          
                    if ($key == "mc_gross_4") {
                        $this->mc_gross_4 = $value;          
                    }          
                    if ($key == "mc_gross_5") {
                        $this->mc_gross_5 = $value;          
                    }          
                    if ($key == "quantity1") {
                        $this->quantity1 = $value;          
                    }          
                    if ($key == "quantity2") {
                        $this->quantity2 = $value;          
                    }          
                    if ($key == "quantity3") {
                        $this->quantity3 = $value;          
                    }          
                    if ($key == "quantity4") {
                        $this->quantity4 = $value;          
                    }          
                    if ($key == "quantity5") {
                        $this->quantity5 = $value;          
                    }          
                    if ($key == "item_name2") {
                        $this->item_name2 = $value;          
                    }          
                    if ($key == "item_name3") {
                        $this->item_name3 = $value;          
                    }          
                    if ($key == "item_name4") {
                        $this->item_name4 = $value;          
                    }          
                    if ($key == "item_name5") {
                        $this->item_name5 = $value;          
                    }          
                    if ($key == "custom") {
                        $this->custom = $value;          
                    }          


                  }            
                    error_log( print_R("got paypal output for: $this->first_name  $this->last_name  \n", TRUE), 3, LOG);


            return true;
        } else {
        //  echo "PaypalIPN The response from IPN was: <b>" . $res ."</b>";
              // IPN invalid, log for manual investigation
                error_log( print_R("PIN error req:" . $this->getPaypalUri() . "\n", TRUE), 3, LOG);
                error_log( print_R($req . "\n", TRUE), 3, LOG);
                error_log( print_R("PIN error response to this request\n", TRUE), 3, LOG);
                error_log( print_R($res . "\n", TRUE), 3, LOG);

                foreach($myPost as $key => $value) {
                    error_log( print_R( $key . " = " . $value . "\n", TRUE), 3, LOG);
                  }            
            
            return false;
        }
    }
}
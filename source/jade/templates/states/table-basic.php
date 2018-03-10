<?php
function param_default( $def = array(), $parameters= array() ){
    $parm_diff = array();
    $ak=array();
    $va=array();
    $parm = array();
    foreach($def as $key=>$values) if(!in_array($key, array_keys($parameters))){
        $ak[]=$key;
        $va[]=$values;
    }
    $parm_diff = array_combine($ak,$va);
    $parm = array_merge($parm_diff,$parameters);
    unset($parm_diff, $ak,$va);

    return $parm;
}

//function strColTemplate($field, $model, $label, $placeholder, $required, $fieldtype) {
function strColTemplate( $parameters = array() ) {

    $def = array(
        'required' => false,
        'fieldtype' => 'text'
     );
     
   $param = param_default( $def, $parameters );    
   
    ob_start(); ?>

    <div class="form-group">
        <label for="<?=$param['field']?>" class="control-label"><?=$param['label']?></label>

        <div>
            <input  id="<?=$param['field']?>" 
                    type="<?=$param['fieldtype']?>" 
                    placeholder="<?=$param['placeholder']?>" 
                    name="<?=$param['field']?>" 
                    ng-model="<?=$param['model']?>" 
                    <?=($param['required']  ? 'required' : '')?> 
                    class="form-control">
        </div>
    </div>

    <?php return ob_get_clean();
}

function textareaColTemplate( $parameters = array() ) {

    $def = array(
        'required' => false
     );
     
   $param = param_default( $def, $parameters );    
   
    ob_start(); ?>

    <div class="form-group">
        <label for="<?=$param['field']?>" class="control-label"><?=$param['label']?></label>

        <div>
            <textarea placeholder="<?=$param['placeholder']?>" 
                    name="<?=$param['field']?>" 
                    ng-model="<?=$param['model']?>" 
                    ng-change="<?=$param['change']?>" 
                    <?=($param['required']  ? 'required' : '')?> 
                    <?=($param['tinymce']  ? 'ui-tinymce="tinymceOptions"' : '')?> 
                    class="form-control"></textarea>
        </div>
    </div>

    <?php return ob_get_clean();
}

//function timepickerColTemplate($hourStep, $minuteStep, $showMeridian, $model,  $required ) {
function timepickerColTemplate( $parameters = array() ) {

    $def = array(
        'required' => false,
        'showMeridian' => "false",
        'hourStep' => 1,
        'minuteStep' => 5
     );
     
   $param = param_default( $def, $parameters );    

    ob_start(); ?>
    <div class="form-group">
<!--        <label for="<?=$param['field']?>" class="control-label"><?=$param['label']?></label> -->
        <div id="<?=$param['field']?>"  uib-timepicker 
            <?=($param['required']  ? 'required' : '')?> 
            hour-step="<?=$param['hourStep']?>" 
            minute-step="<?=$param['minuteStep']?>" 
            show-meridian="<?=$param['showMeridian']?>" 
            ng-model="<?=$param['model']?>"></div>
    </div>        
    <?php return ob_get_clean();
}

//function toggleswitchColTemplate($field, $model, $label, $required, $form, $onLabel, $offLabel) {
function toggleswitchColTemplate( $parameters = array() ) {

    $def = array(
        'required' => false,
        'onLabel' => 'Yes',
        'offLabel' => 'No'
     );
     
   $param = param_default( $def, $parameters );    
   
    ob_start(); ?>
    <div ng-class="{'has-error': <?=$param['form']?>.<?=$param['field']?>.$invalid, 
                    'has-success': !<?=$param['form']?>.<?=$param['field']?>.$invalid}" class="form-group">
        <label for="<?=$param['field']?>" class="control-label"><?=$param['label']?></label>
        <div class="input-icon right">
            <i data-hover="tooltip" data-original-title="Correct" 
            ng-show="<?=$param['form']?>.<?=$param['field']?>.$dirty" 
            ng-class="<?=$param['form']?>.<?=$param['field']?>.$invalid ? 'glyphicon-remove' : 'glyphicon-ok' " 
            class="glyphicon tooltips"></i>
            <toggle-switch 
                    on-label="<?=$param['onLabel']?>" 
                    off-label="<?=$param['offLabel']?>" 
                    id="<?=$param['field']?>" 
                    type="checkbox" 
                    name="<?=$param['field']?>" 
                    ng-model="<?=$param['model']?>" 
                <?=($param['required']  ? 'required' : '')?>
                ng-model-options="{ updateOn: 'default blur', debounce: { 'default': 1500, 'blur': 0 } }" 
                class="switch-primary">
            </toggle-switch>
        </div>
        <div style="color:maroon" role="alert" 
            ng-messages="<?=$param['form']?>.<?=$param['field']?>.$error" 
            class="has-error">
            <div ng-message="required">You did not enter a field</div>
        </div>
    </div>
    <?php return ob_get_clean();
}

//function selectColTemplate($field, $model, $label, $placeholder, $required, $form, $repeatmodel, $repeatvalue, $repeatid) {
function selectColTemplate( $parameters = array() ) {

    $def = array(
        'required' => false
     );
     
   $param = param_default( $def, $parameters );    

    ob_start(); ?>

    <div ng-class="{'has-error': <?=$param['form']?>.<?=$param['field']?>.$invalid, 
                    'has-success': !<?=$param['form']?>.<?=$param['field']?>.$invalid}" class="form-group">
        <label for="<?=$param['field']?>" class="control-label"><?=$param['label']?></label>
        <div class="input-icon right">
            <i data-hover="tooltip" data-original-title="Correct" 
            ng-show="<?=$param['form']?>.<?=$param['field']?>.$dirty" 
            ng-class="<?=$param['form']?>.<?=$param['field']?>.$invalid ? 'glyphicon-remove' : 'glyphicon-ok' " 
            class="glyphicon tooltips"></i>
            <select id="<?=$param['field']?>" type="text" 
                name="<?=$param['field']?>" 
                ng-model="<?=$param['model']?>" 
                <?=(isset($param['changefunction']) ? 'ng-change="' . $param['changefunction'] . '"' : '')?>
                <?=($param['required']  ? 'required' : '')?> 
                ng-model-options="{ updateOn: 'default blur', debounce: { 'default': 1500, 'blur': 0 } }" 
                class="form-control">
                <option 
                    ng-repeat="iter in <?=$param['repeatmodel']?>" 
                    ng-selected="{{iter.<?=$param['repeatid']?>==<?=$param['model']?>}}" 
                    placeholder="<?=$param['placeholder']?>" 
                    value="{{ iter.<?=$param['repeatid']?> }}">{{ iter.<?=$param['repeatvalue']?> }}</option>
            </select>
        </div>
        <div style="color:maroon" role="alert" 
            ng-messages="<?=$param['form']?>.<?=$param['field']?>.$error" 
            class="has-error">
            <div ng-message="required">You did not enter a field</div>
        </div>
    </div>
    
    <?php return ob_get_clean();
}

//function btnColTemplate($field, $click, $label, $color, $style) {
function btnColTemplate( $parameters = array() ) {

    $def = array(
        'color' => 'green',
        'style' => 'fa-plus'
     );
     
   $param = param_default( $def, $parameters );    

    ob_start(); ?>
        <label for="<?=$param['field']?>" class="control-label">&nbsp; </label>
        <a role="button" class="btn btn-<?=$param['color']?> form-control" 
            ng-click="<?=$param['click']?>"><i class="fa <?=$param['style']?>"></i>&nbsp; <?=$param['label']?></a>
    <?php return ob_get_clean();
}

function dateColTemplate( $parameters = array() ) {

    $def = array(
        'required' => false,
        'fieldtype' => 'text',
        'dateFormat' => 'MM/dd/yyyy'
     );
     
   $param = param_default( $def, $parameters );    
   
    ob_start(); ?>

    <div class="form-group">
        <label for="<?=$param['field']?>" class="control-label"><?=$param['label']?></label>

      <div class="col-md-11" style="padding-right: 0px;">
          <div class="input-icon right">
            <input  id="<?=$param['field']?>" 
                    type="<?=$param['fieldtype']?>" 
                    placeholder="<?=$param['placeholder']?>" 
                    is-open="<?=$param['isopen']?>"
                    uib-datepicker-popup="<?=$param['dateFormat']?>" 
                    name="<?=$param['field']?>" 
                    ng-model="<?=$param['model']?>" 
                    <?=($param['required']  ? 'required' : '')?> 
                    class="form-control">
            </div>
        </div>
      <div class="col-md-1" style="padding-right: 0px; padding-left: 0px;">
          <button type="button" class="btn btn-green" ng-click="<?=$param['dopen']?>"><i class="glyphicon glyphicon-calendar"></i></button>
        </div>

    </div>

<?php return ob_get_clean();
}

?>
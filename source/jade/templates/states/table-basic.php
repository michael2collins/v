<?php

function strColTemplate($field, $model, $label, $placeholder, $required, $fieldtype) {
    ob_start(); ?>

    <div class="form-group">
        <label for="<?=$field?>" class="control-label"><?=$label?></label>
        <div>
            <input id="<?=$field?>" type="<?=$fieldtype?>" placeholder="<?=$placeholder?>" name="<?=$field?>" ng-model="<?=$model?>" <?=($required  ? 'required' : '')?> class="form-control">
        </div>
    </div>

    <?php return ob_get_clean();
}

function timepickerColTemplate($hourStep, $minuteStep, $showMeridian, $model,  $required ) {
    ob_start(); ?>
    <div uib-timepicker <?=($required  ? 'required' : '')?> hour-step="<?=$hourStep?>" minute-step="<?=$minuteStep?>" show-meridian="<?=$showMeridian?>" ng-model="<?=$model?>"></div>
    <?php return ob_get_clean();
}

function toggleswitchColTemplate($field, $model, $label, $required, $form, $onLabel, $offLabel) {
    ob_start(); ?>
    <div ng-class="{'has-error': <?=$form?>.<?=$field?>.$invalid, 
                    'has-success': !<?=$form?>.<?=$field?>.$invalid}" class="form-group">
        <label for="<?=$field?>" class="control-label"><?=$label?></label>
        <div class="input-icon right">
            <i data-hover="tooltip" data-original-title="Correct" 
            ng-show="<?=$form?>.<?=$field?>.$dirty" 
            ng-class="<?=$form?>.<?=$field?>.$invalid ? 'glyphicon-remove' : 'glyphicon-ok' " 
            class="glyphicon tooltips"></i>
            <toggle-switch on-label="<?=$onLabel?>" off-label="<?=$offLabel?>" id="<?=$field?>" 
                type="checkbox" name="<?=$field?>" ng-model="<?=$model?>" 
                <?=($required  ? 'required' : '')?>
                ng-model-options="{ updateOn: 'default blur', debounce: { 'default': 1500, 'blur': 0 } }" class="switch-primary">
            </toggle-switch>
        </div>
        <div style="color:maroon" role="alert" ng-messages="<?=$form?>.<?=$field?>.$error" class="has-error">
            <div ng-message="required">You did not enter a field</div>
        </div>
    </div>
    <?php return ob_get_clean();
}

function selectColTemplate($field, $model, $label, $placeholder, $required, $form, $repeatmodel, $repeatvalue, $repeatid) {
    ob_start(); ?>

    <div ng-class="{'has-error': <?=$form?>.<?=$field?>.$invalid, 'has-success': !<?=$form?>.<?=$field?>.$invalid}" class="form-group">
        <label for="<?=$field?>" class="control-label"><?=$label?></label>
        <div class="input-icon right">
            <i data-hover="tooltip" data-original-title="Correct" ng-show="<?=$form?>.<?=$field?>.$dirty" 
                ng-class="<?=$form?>.<?=$field?>.$invalid ? 'glyphicon-remove' : 'glyphicon-ok' " class="glyphicon tooltips"></i>
            <select id="<?=$field?>" type="text" 
                name="<?=$field?>" 
                ng-model="<?=$model?>" 
                <?=($required  ? 'required' : '')?> 
                ng-model-options="{ updateOn: 'default blur', debounce: { 'default': 1500, 'blur': 0 } }" 
                class="form-control">
                <option 
                    ng-repeat="iter in <?=$repeatmodel?>" 
                    ng-selected="{{iter.<?=$repeatid?>==<?=$model?>}}" 
                    placeholder="<?=$placeholder?>" 
                    value="{{ iter.<?=$repeatid?> }}">{{ iter.<?=$repeatvalue?> }}</option>
            </select>
        </div>
        <div style="color:maroon" role="alert" ng-messages="<?=$form?>.<?=$field?>.$error" class="has-error">
            <div ng-message="required">You did not enter a field</div>
        </div>
    </div>
    
    <?php return ob_get_clean();
}

function btnColTemplate($field, $click, $label, $color, $style) {
    ob_start(); ?>
        <label for="<?=$field?>" class="control-label">&nbsp; </label>
        <a role="button" class="btn btn-<?=$color?> form-control" 
            ng-click="<?=$click?>"><i class="fa <?=$style?>"></i>&nbsp; <?=$label?></a>
    <?php return ob_get_clean();
}

?>
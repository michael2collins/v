let iddropdown = function() {

 return function(input, context) {

        try {

            var map = context.col.colDef.editDropdownOptionsArray;
            var idField = context.col.colDef.editDropdownIdLabel;
            var valueField = context.col.colDef.editDropdownValueLabel;
            var initial = context.row.entity[context.col.field];
            if (typeof map !== "undefined") {
                for (var i = 0; i < map.length; i++) {
                    if (map[i][idField] == input) {
                        return map[i][valueField];
                    }
                }
            }
            else if (initial) {
                return initial;
            }
            return input;

        }
        catch (e) {
            //            context.grid.appScope.log("Error: " + e);
            console.log("error: " + e);
        }
    };

};
export default iddropdown;
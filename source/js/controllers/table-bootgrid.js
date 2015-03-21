App.controller('TableBootgridController', function ($scope, $routeParams){
    $(function()
        {
            $("#grid").bootgrid({
                //ajax: true,
                post: function ()
                {
                    return {
                        mailboxItemId: "b0df282a-0d67-40e5-8558-c9e93b7befed"
                    };
                },
                url: "../vendors/jquery-bootgrid/data.json",
                pagination: 3,
                formatters: {
                    "link": function(column, row)
                    {
                        return "<a href=\"#\">" + column.id + ": " + row.id + "</a>";
                    }
                }
            });
            
            $("#append").on("click", function ()
            {
                $("#grid").bootgrid("append", [{
                        id: 0,
                        sender: "hh@derhase.de",
                        received: "Gestern",
                        link: ""
                    },
                    {
                        id: 12,
                        sender: "er@fsdfs.de",
                        received: "Heute",
                        link: ""
                    }]);
            });
            
            $("#clear").on("click", function ()
            {
                $("#grid").bootgrid("clear");
            });
            
            $("#removeSelected").on("click", function ()
            {
                $("#grid").bootgrid("remove");
            });
            
            $("#destroy").on("click", function ()
            {
                $("#grid").bootgrid("destroy");
            });
            
            $("#init").on("click", function ()
            {
                $("#grid").bootgrid({
                    formatters: {
                        "link": function(column, row)
                        {
                            return "<a href=\"#\">" + column.id + ": " + row.id + "</a>";
                        }
                    }
                });
            });
        });
});
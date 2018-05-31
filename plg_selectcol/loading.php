<?php

global $hide_export;
$hide_export = @$_SESSION[CurrentPage()->PageObjName."_hide_export"];
CurrentPage()->hide_export = @$_GET["hide_export"]? explode(",", $_GET["hide_export"]) : $hide_export;
$_SESSION[CurrentPage()->PageObjName."_hide_export"] = CurrentPage()->hide_export;

CurrentPage()->ExportAll = is_null(@$_SESSION[CurrentPage()->PageObjName."_ExportAll"]) ? CurrentPage()->ExportAll : $_SESSION[CurrentPage()->PageObjName."_ExportAll"];
CurrentPage()->ExportAll = @$_GET["export_page"]? $_GET["export_page"] == "all" : CurrentPage()->ExportAll;
$_SESSION[CurrentPage()->PageObjName."_ExportAll"] = CurrentPage()->ExportAll;

global $EW_EXPORT;
if (CurrentPage()->CustomExport == "" && in_array(CurrentPage()->Export, array_keys($EW_EXPORT))) {
    foreach (CurrentPage()->hide_export as $i => $value) {
        $fld = @get_object_vars ( CurrentPage() )[$value];
        if($fld)
            $fld->Exportable = FALSE;
    }
}

?>

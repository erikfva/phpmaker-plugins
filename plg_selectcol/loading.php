<?php

global $hide_export;
$hide_export = @$_SESSION[CurrentPage()->PageObjName."_hide_export"];
CurrentPage()->hide_export = @$_GET["hide_export"]? explode(",", $_GET["hide_export"]) : $hide_export;
$_SESSION[CurrentPage()->PageObjName."_hide_export"] = CurrentPage()->hide_export;


global $EW_EXPORT;
if (CurrentPage()->CustomExport == "" && in_array(CurrentPage()->Export, array_keys($EW_EXPORT))) {
    foreach (CurrentPage()->hide_export as $i => $value) {
        $fld = @get_object_vars ( CurrentPage() )[$value];
        if($fld)
            $fld->Exportable = FALSE;
    }
}

?>

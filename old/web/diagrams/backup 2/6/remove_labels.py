import  shutil
import os
#shutil.move(src,dst) #move file
#shutil.copy(src,dst) #copy file

intersections = ["a","b","c","d","e", "f", "ab", "ac", "ad", "ae", "af", "bc", "bd", "be", "bf", "cd", "ce", "cf", "de", "df", "ef", "abc", "abd", "abe", "abf", "acd", "ace", "acf", "ade", "adf", "aef", "bcd", "bce", "bcf", "bde", "bdf", "bef", "cde", "cdf", "cef", "def", "abcd", "abce", "abcf", "abde", "abdf", "abef", "acde", "acdf", "acef", "adef", "bcde", "bcdf", "bcef", "bdef", "cdef", "abcde", "abcdf", "abcef", "abdef", "acdef", "bcdef"]#,"abcdef"
#56+6+1=63

names =["ab", "ac", "ad", "ae", "af", "bc", "bd", "be", "bf", "cd", "ce", "cf", "de", "df", "ef", "ab_cd", "ab_ce", "ab_cf", "ab_de", "ab_df", "ab_ef", "ac_bd", "ac_be", "ac_bf", "ac_de", "ac_df", "ac_ef", "ad_bc", "ad_be", "ad_bf", "ad_ce", "ad_cf", "ad_ef", "ae_bc", "ae_bd", "ae_bf", "ae_cd", "ae_cf", "ae_df", "af_bc", "af_bd", "af_be", "af_cd", "af_ce", "af_de", "bc_de", "bc_df", "bc_ef", "bd_ce", "bd_cf", "bd_ef", "be_cd", "be_cf", "be_df", "bf_cd", "bf_ce", "bf_de", "cd_ef", "ce_df", "cf_de", "abc", "abd", "abe", "abf", "acd", "ace", "acf", "ade", "adf", "aef", "bcd", "bce", "bcf", "bde", "bdf", "bef", "cde", "cdf", "cef", "def", "abc_def", "abd_cef", "abe_cdf", "abf_cde", "acd_bef", "ace_bdf", "acf_bde", "ade_bcf", "adf_bce", "aef_bcd", "abcd", "abce", "abcf", "abde", "abdf", "abef", "acde", "acdf", "acef", "adef", "bcde", "bcdf", "bcef", "bdef", "cdef", "abcd_ef", "abce_df", "abcf_de", "abde_cf", "abdf_ce", "abef_cd", "acde_bf", "acdf_be", "acef_bd", "adef_bc", "af_bcde", "ae_bcdf", "ad_bcef", "ac_bdef", "ab_cdef", "abcde", "abcdf", "abcef", "abdef", "acdef", "bcdef", "ab_cde", "ab_cdf", "ab_cef", "ab_def", "ac_bde", "ac_bdf", "ac_bef", "ac_def", "ad_bce", "ad_bcf", "ad_bef", "ad_cef", "ae_bcd", "ae_bcf", "ae_cdf", "ae_bdf", "af_bcd", "af_bce", "af_bde", "af_cde", "bc_def", "bd_cef", "be_cdf", "bf_cde", "cd_bef", "ce_bdf", "cf_bde", "de_bcf", "df_bce", "ef_bcd", "abc_de", "abc_df", "abc_ef", "abd_ce", "abd_cf", "abd_ef", "abe_cd", "abe_cf", "abe_df", "abf_cd", "abf_ce", "abf_de", "acd_be", "acd_bf", "acd_ef", "ace_bd", "ace_bf", "ace_df", "acf_bd", "acf_be", "acf_de", "ade_bc", "ade_bf", "ade_cf", "adf_bc", "adf_be", "adf_ce", "aef_bc", "aef_bd", "aef_cd", "bcd_ef", "bce_df", "bcf_de", "bde_cf", "bdf_ce", "bef_cd"] #"abcdef",


for name in names:
    newname = "6waydiagram_"+name+".svg"    
    union = []
    splited = name.split('_')
    for part in splited:
        part_union = []
        for c in part:
            part_union.append(c)
        union.append(part_union)
        
    remove = ""
    to_remove = []
    for part in union:
        if len(part) == 2:
            for inter in intersections:
                if part[0] in inter and not part[1] in inter:
                    to_remove.append(inter)
                elif part[1] in inter and not part[0] in inter:
                    to_remove.append(inter)
        elif len(part) == 3:
            for inter in intersections:
                if part[0] in inter and (not part[1] in inter or not part[2] in inter):
                    to_remove.append(inter)
                elif part[1] in inter and (not part[0] in inter or not part[2] in inter):
                    to_remove.append(inter)
                elif part[2] in inter and (not part[0] in inter or not part[1] in inter):
                    to_remove.append(inter)
    
        elif len(part) == 4:
            for inter in intersections:
                if part[0] in inter and (not part[1] in inter or not part[2] in inter or not part[3] in inter):
                    to_remove.append(inter)
                elif part[1] in inter and (not part[0] in inter or not part[2] in inter or not part[3] in inter):
                    to_remove.append(inter)
                elif part[2] in inter and (not part[0] in inter or not part[1] in inter or not part[3] in inter):
                    to_remove.append(inter)
                elif part[3] in inter and (not part[0] in inter or not part[1] in inter or not part[2] in inter):
                    to_remove.append(inter)    
                    
                    
        elif len(part) == 5:
            for inter in intersections:
                if part[0] in inter and (not part[1] in inter or not part[2] in inter or not part[3] in inter or not part[4] in inter):
                    to_remove.append(inter)
                elif part[1] in inter and (not part[0] in inter or not part[2] in inter or not part[3] in inter or not part[4] in inter):
                    to_remove.append(inter)
                elif part[2] in inter and (not part[0] in inter or not part[1] in inter or not part[3] in inter or not part[4] in inter):
                    to_remove.append(inter)
                elif part[3] in inter and (not part[0] in inter or not part[1] in inter or not part[2] in inter or not part[4] in inter):
                    to_remove.append(inter)
                elif part[4] in inter and (not part[0] in inter or not part[1] in inter or not part[2] in inter or not part[3] in inter):
                    to_remove.append(inter) 
    
    command = "inkscape -f "+newname+" --verb=EditDeselect "
    for item in to_remove:
        command = command + "--select="+item+" "
    command = command + "--verb=EditDelete --verb=FileSave --verb=FileClose"
    
    os.system(command)   
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
            

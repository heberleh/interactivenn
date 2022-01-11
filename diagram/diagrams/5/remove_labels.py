import  shutil
import os
#shutil.move(src,dst) #move file
#shutil.copy(src,dst) #copy file


intersections = ['a','b','c','d','e',"ab","ac","ad","ae","bc","bd","be","cd","ce","de","abc",
"abd","abe","acd","ace","ade","bcd","bce","bde","cde",
"abcd","abce","abde","acde","bcde"] #,"abcde"

names =["ab","ac","ad","ae","bc","bd","be","cd","ce","de","abc",
"abd","abe","acd","ace","ade","bcd","bce","bde","cde",
"abcd","abce","abde","acde","bcde","ab_cd","ab_ce",
"ab_de","ac_bd","ac_be","ac_de","ad_bc","ad_be","ad_ce","ae_bc",
"ae_bd","ae_cd","bc_de","bd_ce","be_cd","cb_de","abc_de","abd_ce",
"abe_cd","acd_be","ace_bd","ade_bc","ae_bcd","ad_bce","ac_bde","ab_cde"] #,"abcde"


#names =["cb_de"]
#names = ["ae_bcd","ad_bce","ac_bde","ab_cde"]

for name in names:
    newname = "5waydiagram_"+name+".svg"    
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
    
    command = "inkscape -f "+newname+" --verb=EditDeselect "
    for item in to_remove:
        command = command + "--select="+item+" "
    command = command + "--verb=EditDelete --verb=FileSave --verb=FileClose"
    
    os.system(command)   
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
            

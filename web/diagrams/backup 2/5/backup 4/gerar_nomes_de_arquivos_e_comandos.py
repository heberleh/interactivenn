import  shutil
import os
#shutil.move(src,dst) #move file
#shutil.copy(src,dst) #copy file


intersections = ['a','b','c','d','e',"ab","ac","ad","ae","bc","bd","be","cd","ce","de","abc",
"abd","abe","acd","ace","ade","bcd","bce","bde","cde",
"abcd","abce","abde","acde","bcde","abcde"]

names =["ab","ac","ad","ae","bc","bd","be","cd","ce","de","abc",
"abd","abe","acd","ace","ade","bcd","bce","bde","cde",
"abcd","abce","abde","acde","bcde","abcde","ab_cd","ab_ce",
"ab_de","ac_bd","ac_be","ac_de","ad_bc","ad_be","ad_ce","ae_bc",
"ae_bd","ae_cd","bc_de","bd_ce","be_cd","cb_de","abc_de","abd_ce",
"abe_cd","acd_be","ace_bd","ade_bc","bcd_ae","bce_ad","bde_ac","cde_ab"]


for name in names:
    newname = "5waydiagram_"+name+".svg"
    shutil.copy("5waydiagram.svg",newname)
    union = []
    splited = name.split('_')
    for part in splited:
        part_union = []
        for c in part:
            part_union.append(c)
        union.append(part_union)
        
            
        
    #inkscape -f 5waydiagram.svg --select=elipseA --select=elipseB --       verb=SelectionUnion --verb=FileSave --verb=FileClose
    command = "inkscape -f "+newname+" --verb=EditDeselect "
    for part in union:
        for e in part:
            command = command + "--select=elipse"+e.upper()+" "
        command = command + "--verb=SelectionUnion --verb=EditDeselect "
    command = command + "--verb=FileSave --verb=FileClose"
    
    os.system(command)
    print newname +" saved"

import  shutil
import os
#shutil.move(src,dst) #move file
#shutil.copy(src,dst) #copy file


intersections = ['a','b','c','d',"ab","ac","ad","bc","bd","cd","abc","abd","acd","bcd","abcd"]

names =["ab","ac","ad","bc","bd","cd","abc","abd","acd","bcd","abcd","ab_cd","ac_bd","ad_bc","abcd"]


for name in names:
    newname = "4waydiagram_"+name+".svg"    
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
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
            

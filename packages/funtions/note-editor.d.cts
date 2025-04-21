
type TiptapNode = {
    type: string;
    content?: TiptapNode[];
    text?: string;
  };
  
export default function CovertNotesToText(notes:TiptapNode):string{
    let result = "";
    function walk(node:TiptapNode) {
            if (node.text) {
              result += node.text + " ";
            }
        
            if (node.content && Array.isArray(node.content)) {
              node.content.forEach(walk);
            }
          
        }
        walk(notes)
        return result.trim()
        }        







}
import Note_Taking from "@/components/notes/note-taking";




export default function addNote (){
    return(
        <div className="w-4xl">
            <Note_Taking isOpen={true} onClose={()=>{}} />
        </div>
    )
}
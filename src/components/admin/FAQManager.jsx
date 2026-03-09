import { useState, useEffect } from "react";

const API = "http://localhost:5000/faqs";

export default function FAQManager() {

const [faqs,setFaqs] = useState([]);
const [question,setQuestion] = useState("");
const [answer,setAnswer] = useState("");

const loadFaqs = async () => {

const res = await fetch(API);
const data = await res.json();

setFaqs(data);

};

useEffect(()=>{
loadFaqs();
},[]);


const addFaq = async () => {

await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({question,answer})
});

setQuestion("");
setAnswer("");

loadFaqs();

};


const deleteFaq = async (index) => {

await fetch(API+"/"+index,{
method:"DELETE"
});

loadFaqs();

};

return (

<div>

<div style={{marginBottom:"20px"}}>

<input
placeholder="Question"
value={question}
onChange={(e)=>setQuestion(e.target.value)}
/>

<input
placeholder="Answer"
value={answer}
onChange={(e)=>setAnswer(e.target.value)}
/>

<button onClick={addFaq}>Add FAQ</button>

</div>

<table border="1" width="100%">

<thead>

<tr>
<th>Question</th>
<th>Answer</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{faqs.map((faq,index)=>(

<tr key={index}>

<td>{faq.question}</td>
<td>{faq.answer}</td>

<td>

<button onClick={()=>deleteFaq(index)}>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

);

}
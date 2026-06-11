import {
 collection,
 getDocs,
 addDoc,
 deleteDoc,
 doc
} from "firebase/firestore";

import {db} from "../firebase/config";


const insumosRef = collection(
    db,
    "insumos"
);



export async function buscarInsumos(){

    const snapshot = await getDocs(insumosRef);


    return snapshot.docs.map(item => ({
        id:item.id,
        ...item.data()
    }));

}



export async function criarInsumo(dados){

    await addDoc(
        insumosRef,
        dados
    );

}



export async function removerInsumo(id){

    await deleteDoc(
        doc(db,"insumos",id)
    );

}
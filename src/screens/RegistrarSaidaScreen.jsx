import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  colors,
  spacing,
  radius,
  typography
} from '../theme';

import {
  ScreenHeader,
  NumberInput,
  PrimaryButton,
  SelectField
} from '../components/UI';


import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';

import db from '../firebase/firestore';



export default function RegistrarSaidaScreen({ navigation }) {


  const [insumos,setInsumos] = useState([]);

  const [insumoSelecionado,setInsumoSelecionado] = useState('');

  const [quantidade,setQuantidade] = useState(1);

  const [destino,setDestino] = useState('');

  const [responsavel,setResponsavel] = useState('');

  const [data,setData] = useState(new Date());

  const [showPicker,setShowPicker] = useState(false);



  useEffect(()=>{


    async function carregarInsumos(){


      const snapshot = await getDocs(
        collection(db,'insumos')
      );


      const lista = snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

      }));


      setInsumos(lista);


    }


    carregarInsumos();


  },[]);





  const handleConfirmar = async()=>{


    const insumo = insumos.find(

      item => item.id === insumoSelecionado

    );



    if(!insumo){


      Alert.alert(
        'Atenção',
        'Selecione um insumo.'
      );

      return;

    }



    if(quantidade <= 0){


      Alert.alert(
        'Atenção',
        'Informe uma quantidade válida.'
      );

      return;

    }




    if(quantidade > insumo.qtd){


      Alert.alert(

        'Estoque insuficiente',

        `Quantidade disponível: ${insumo.qtd}`

      );


      return;

    }





    try{


      // atualiza estoque

      await updateDoc(

        doc(
          db,
          'insumos',
          insumo.id
        ),

        {

          qtd:
          insumo.qtd - quantidade

        }

      );





      // registra movimentação

      await addDoc(

        collection(db,'movimentacoes'),

        {


          insumoId:insumo.id,


          insumoNome:insumo.nome,


          tipo:'Saída',


          qtd:quantidade,


          destino,


          responsavel,


          data:data.toLocaleDateString('pt-BR'),


          criadoEm:new Date()

        }

      );






      Alert.alert(

        'Saída registrada!',

        'A saída foi registrada com sucesso.',

        [

          {

            text:'OK',

            onPress:()=>navigation.goBack()

          }

        ]

      );



    }catch(error){


      console.log(error);


      Alert.alert(
        'Erro',
        'Não foi possível registrar saída.'
      );


    }



  };






  return (

    <SafeAreaView style={styles.safe}>


      <ScreenHeader

        title="Registrar Saída"

        onBack={()=>navigation.goBack()}

      />



      <KeyboardAvoidingView

        style={styles.flex}

        behavior={
          Platform.OS === 'ios'
          ? 'padding'
          : 'height'
        }

      >


        <ScrollView

          contentContainerStyle={styles.content}

        >



          <View style={styles.card}>


            <View style={styles.fieldGroup}>


              <Text style={styles.label}>
                Insumo
              </Text>



              <SelectField

                value={insumoSelecionado}

                onChange={setInsumoSelecionado}

                options={

                  insumos.map(item=>({

                    label:
                    `${item.nome} (${item.qtd})`,

                    value:item.id

                  }))

                }

                placeholder="Selecione o insumo..."

              />



            </View>





            <View style={styles.fieldGroup}>


              <Text style={styles.label}>
                Quantidade
              </Text>



              <NumberInput

                value={quantidade}

                onIncrement={()=>
                  setQuantidade(q=>q+1)
                }

                onDecrement={()=>
                  setQuantidade(q=>Math.max(0,q-1))
                }

              />



            </View>






            <View style={styles.fieldGroup}>


              <Text style={styles.label}>
                Destino / Setor
              </Text>



              <TextInput

                value={destino}

                onChangeText={setDestino}

                placeholder="Nome do setor..."

                style={styles.input}

              />


            </View>






            <View style={styles.fieldGroup}>


              <Text style={styles.label}>
                Responsável
              </Text>



              <TextInput

                value={responsavel}

                onChangeText={setResponsavel}

                placeholder="Nome do responsável..."

                style={styles.input}

              />



            </View>






            <View style={styles.fieldGroup}>


              <Text style={styles.label}>
                Data da saída
              </Text>



              <TouchableOpacity

                style={styles.dateButton}

                onPress={()=>setShowPicker(true)}

              >


                <Text style={styles.dateButtonText}>

                  {data.toLocaleDateString('pt-BR')}

                </Text>


                <Text style={styles.dateChevron}>
                  ›
                </Text>


              </TouchableOpacity>





              {showPicker && (

                <DateTimePicker

                  value={data}

                  mode="date"

                  onChange={(e,d)=>{

                    setShowPicker(false);

                    if(d)
                      setData(d);

                  }}

                />

              )}



            </View>





            <PrimaryButton

              title="Confirmar saída"

              onPress={handleConfirmar}

            />


          </View>



        </ScrollView>


      </KeyboardAvoidingView>



    </SafeAreaView>

  );


}






const styles = StyleSheet.create({

safe:{
flex:1,
backgroundColor:colors.background
},

flex:{
flex:1
},

content:{
padding:spacing.md,
paddingBottom:spacing.xl
},

card:{
backgroundColor:colors.surface,
borderRadius:radius.xl,
padding:spacing.md,
gap:spacing.md
},

fieldGroup:{
gap:spacing.xs
},

label:{
fontSize:typography.sizes.sm,
fontWeight:'600',
color:colors.text
},

input:{
backgroundColor:colors.inputBg,
borderWidth:1,
borderColor:colors.border,
borderRadius:radius.md,
padding:spacing.md,
fontSize:typography.sizes.md
},

dateButton:{
flexDirection:'row',
alignItems:'center',
backgroundColor:colors.inputBg,
borderWidth:1,
borderColor:colors.border,
borderRadius:radius.md,
padding:spacing.md
},

dateButtonText:{
flex:1,
fontSize:typography.sizes.md
},

dateChevron:{
fontSize:22
}

});
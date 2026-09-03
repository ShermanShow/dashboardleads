"use client";
import { useMemo, useState } from "react";
import { BarChart3, CalendarDays, CheckCircle2, Users, X } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
const leads=[
  {"id":"359","name":"Selene","last":"","product":"DTF UV","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"360","name":"Leandro","last":"Funes","product":"CAMA PLANA UV","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"361","name":"Ariel","last":"Bonfil","product":"CAMA PLANA UV","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"362","name":"Groove!","last":"","product":"PLOTTER UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"363","name":"Alex","last":"","product":"PLANCHAS","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"364","name":"Silvia","last":"","product":"PLOTTER HIBRIDO","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"365","name":"Alejo","last":"","product":"PLOTTER UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"366","name":"Juan","last":"","product":"CAMA PLANA UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"367","name":"Ezequiel","last":"","product":"ONE PASS","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"368","name":"Jorge","last":"Simon","product":"CAMA PLANA UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"369","name":"","last":"","product":"PLOTTER SUBLIMACION","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"370","name":"","last":"","product":"PLOTTER UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"372","name":"Gisela","last":"","product":"DTF UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"373","name":"Pedro","last":"Manrique","product":"DTF UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"375","name":"Luis","last":"Chaves","product":"IMPRESION PAPEL CORTADO","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"376","name":"Cris","last":"C","product":"DTF UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"377","name":"Luci","last":"","product":"PLOTTER UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"382","name":"Pablo","last":"Gaso","product":"IMPRESION PAPEL CORTADO","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"383","name":"Martín","last":"","product":"CAMA PLANA UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":"Ex cliente incumplidor"},
  {"id":"386","name":"Alejandro","last":"","product":"CAMA PLANA UV","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"388","name":"André","last":"Fontana","product":"DTF UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"390","name":"Dtf","last":"Max Printer","product":"PLOTTER UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"391","name":"Cuadros","last":"Ballester","product":"INSUMOS Y REPUESTOS","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"392","name":"Graciela","last":"Ruiz","product":"DTF TEXTIL","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"395","name":"Victoria","last":"Cardozo","product":"DESCONOCIDO","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"397","name":"anahilafuente74","last":"","product":"DTF TEXTIL","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"398","name":"Sergio","last":"","product":"PLOTTER SUBLIMACION","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"399","name":"Federico Julián","last":"Mirco","product":"PLOTTER UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"400","name":"Gaston","last":"Zalazar","product":"PLOTTER DE CORTE","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"401","name":"Enrique","last":"","product":"IMPRESION PAPEL CORTADO","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"402","name":"Luciano","last":"","product":"CAMA PLANA UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"403","name":"Ivan","last":"Losano","product":"CAMA PLANA UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"404","name":"Angel","last":"","product":"PLOTTER SUBLIMACION","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"405","name":"Elizabeth","last":"","product":"CAMA PLANA UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"406","name":"Sergio","last":"Quiroga","product":"CAMA PLANA UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"407","name":"Juan Pablo","last":"","product":"PLOTTER UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"408","name":"Diego","last":"","product":"PLANCHAS","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"409","name":"Luciano","last":"Tontarelli","product":"CAMA PLANA UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"410","name":"Carolina","last":"","product":"INSUMOS Y REPUESTOS","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"411","name":"Claudio","last":"Duedra","product":"ALQUILER KM","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"412","name":"Gabriel","last":"","product":"ALQUILER KM","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"413","name":"Gilda","last":"Somaini","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola Gilda buenos dias. Mi nombre es Edgardo y me estoy comunicando desde Sistemas y Soluciones Digitales nosotros vendemos equipos de produccion digital, DTF, Cama Plana UV. Me pasaron tu contacto porque estarias buscando una cama plana puede ser?"},
  {"id":"414","name":"Abril","last":"Dominguez","product":"PLOTTER ECOSOLVENTE","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipo Ecosolvente, un plotter. Ya resolvieron ese tema?"},
  {"id":"415","name":"Gustavo Alejandro","last":"Reyna","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipo Cama Plana UV. Ya resolvieron ese tema?"},
  {"id":"416","name":"Maria Esperanza","last":"","product":"PLOTTER UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia! Soy Edgardo de Sistemas y Soluciones, me pasaron tu contacto porque estabas en la busqueda de un plotter UV puede ser?"},
  {"id":"417","name":"Constructora","last":"Patagonia","product":"TONERS","seller":"OFICINA","status":"CERRADO","eventDate":"","action":"","reason":"FALTA STOCK","comment":""},
  {"id":"418","name":"Papucho","last":"","product":"INSUMOS Y REPUESTOS","seller":"OFICINA","status":"CERRADO","eventDate":"","action":"","reason":"FALTA STOCK","comment":""},
  {"id":"420","name":"Rodri","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"421","name":"cecilia","last":"maria formoso","product":"ALQUILER KM","seller":"EDGARDO/ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"PRECIO ALTO","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"422","name":"Fauno","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"423","name":"Joaquín","last":"Orriols","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo me estoy comunicando desde Sistemas y soluciones digitales es porque consultaste por una cama plana Huenu, seguis en la busqueda aun?"},
  {"id":"424","name":"Omar","last":"Cansillieri","product":"PLOTTER DE CORTE","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"426","name":"Analia","last":"-","product":"ALQUILER KM","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenas! Soy Edgardo de sistemas y soluciones digitales, me pasaron tu contacto porque estabas buscando un alquiler de un equipo blanco y negro puede ser?"},
  {"id":"427","name":"Carlos","last":"Garcia","product":"DESCONOCIDO","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"428","name":"Natyyy","last":"","product":"ALQUILER KM","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"PRECIO ALTO","comment":"Hola buen dia! Soy Edgardo de sistemas y soluciones digitales, me pasaron tu contacto porque estas buscando un DTF Textil puede ser?"},
  {"id":"429","name":"Lucas","last":"Pasten","product":"INSUMOS Y REPUESTOS","seller":"OFICINA","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"430","name":"Daniel","last":"Yoverno","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"432","name":"No establecido","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"433","name":"AYE INDUMENTARIA","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"434","name":"Migue","last":"Gonzalez","product":"CAMA PLANA UV","seller":"JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"435","name":"Sandra","last":"Folger","product":"ALQUILER KM","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola Sandra buen dia! Mi nombre es Edgardo me comunico desde Sistemas y Soluciones Digitales, me pasaron tu contacto porque estarias buscando alquilar un equipo puede ser? Que tipo de equipo tenes en mente?"},
  {"id":"436","name":"Santiago","last":"Flores","product":"DTF TEXTIL","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"437","name":"Sublimados y algo más","last":"","product":"ALQUILER KM","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia! Te contacto por que nos llego tu contact para alquilar DTF textil puede ser? Soy Edgardo de Sistemas y Soluciones"},
  {"id":"438","name":"Freak Style","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"439","name":"Jonthan","last":"Donna","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"440","name":"Ernesto","last":"Albini","product":"PLOTTER DE CORTE","seller":"EDGARDO/ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"CONCRETADO","comment":"Cliente con equipo (troqueladora) ya entregado/instalado en Munro. Consulto forma de pago y plazo de entrega de otra maquina, pendiente responder."},
  {"id":"442","name":"Geko","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"444","name":"Yesi","last":"& Dylan","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"CALIDAD LEAD","comment":"era para imprimir"},
  {"id":"445","name":"Welly","last":"Ochoa","product":"CAMA PLANA UV","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"446","name":"Pablo","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"447","name":"Yoni","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"448","name":"Silvina","last":"Fábregas","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"449","name":"LEOMAR","last":"titeres","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"450","name":"FG","last":"LAS-EUC","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"451","name":"Angie","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"452","name":"Riky","last":"Dc","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenas tardes! Soy Edgardo de sistemas y soluciones digitales, me pasaron tu contacto por un plotter uv puede ser? (Respondio: numero equivocado)"},
  {"id":"453","name":"Eliana","last":"Di Gangi","product":"TINTAS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Hable hoy le pase el contacto de Siscop y le mande el contacto a Andrea"},
  {"id":"454","name":"Caro","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"455","name":"Luz","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"456","name":"Marcos","last":"Cáceres","product":"INSUMOS Y REPUESTOS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"457\t18/8/26\tMETA ADS","name":"Paul","last":"","product":"DTF TEXTIL","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenas tardes Paul, mi nombre es Edgardo Marti de Sistemas y soluciones digitales, me pasaron tu contacto por un equipo DTF puede ser? Que buscas DTF UV o Textil?"},
  {"id":"458","name":"Branco","last":"Mursilli","product":"CAMA PLANA UV","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"459","name":"Joaquin","last":"Fernandez","product":"MESA DE CORTE","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenas tardes! Soy Edgardo de Sistemas y soluciones digitales, me pasaron tu contacto por una mesa de corte teneth puede ser?"},
  {"id":"460","name":"Marcos","last":"Galindez","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenas tardes! Soy Edgardo de Sistemas y soluciones digitales, me pasaron tu contacto por una cama plana de 60x90 puede ser?"},
  {"id":"461","name":"Luis","last":"Meddis","product":"MESA DE CORTE","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenas tardes! Soy Edgardo de Sistemas y soluciones digitales, me pasaron tu contacto por un equipo para imprimir packaging puede ser?"},
  {"id":"462","name":"Patricio","last":"Gutierrez","product":"DTF UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenas tardes! Soy Edgardo de Sistemas y soluciones digitales, me pasaron tu contacto por un DTF Textil para hacer Escudos TPU puede ser?"},
  {"id":"463","name":"Ramiro","last":"Giuffre","product":"CAMA PLANA UV","seller":"EDGARDO/JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Hola buenas tardes! Soy Edgardo de Sistemas y soluciones digitales, me pasaron tu contacto por una cama plana Dlican puede ser?"},
  {"id":"464","name":"Dina","last":"Eva Romero","product":"DTF UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenas tardes, mi nombre es Edgardo te hablo de Sistemas y soluciones, me pasaron tu contacto porque estabas buscando un equipo para imprimir tazas entre otras cosas puede ser?"},
  {"id":"466","name":"Carlos","last":"Garcia","product":"IMPRESION PAPEL CORTADO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola Carlos, buenas tardes mi nombre es Edgardo Marti de Sistemas y Soluciones Digitales, me pasaron tu contacto por que estabas buscando un equipo para imprimir cartulina puede ser?"},
  {"id":"467","name":"Mauro","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buenos dias! Mi nombre es Edgardo de la firma Sistemas y Soluciones. Me contacto porque hace un tiempo estuvo haciendo averiguaciones por un equipos de impresion para productos graficos. Ya resolvieron ese tema?"},
  {"id":"468","name":"Eli","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola! Soy Edgardo de sistemas y soluciones buenas tardes! Me pasaron tu contacto porque estabas buscando una cama plana puede ser?"},
  {"id":"469","name":"Victoria","last":"","product":"DTF TEXTIL","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola! Soy Edgardo de sistemas y soluciones buenas tardes! Me pasaron tu contacto porque estabas buscando un equipo DTF puede ser?"},
  {"id":"470","name":"Martin","last":"Ambres","product":"PLOTTER HIBRIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia! Soy Edgardo de Sistemas y Soluciones, me pasaron tu contacto porque estabas buscando hibridos puede ser?"},
  {"id":"471","name":"Nicolas","last":"","product":"DTF TEXTIL","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser? DTF y Sublimacion?"},
  {"id":"472","name":"Pablo","last":"Mamani","product":"PLOTTER SUBLIMACION","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Interesado en Sublmacion"},
  {"id":"473","name":"Gabriel","last":"Viani","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser? DTF y Sublimacion?"},
  {"id":"474","name":"Martín","last":"Benítez","product":"INSUMOS Y REPUESTOS","seller":"OFICINA","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"475","name":"Bruno","last":"H Ojeda","product":"PLOTTER UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"NO LO SIENTO, ME RESPONDIO"},
  {"id":"476","name":"COMPRAS","last":"IC","product":"TINTAS","seller":"OFICINA","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"A958:N958","name":"Elii","last":"Saborido","product":"PLOTTER UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"478","name":"Mari","last":"","product":"TINTAS","seller":"OFICINA","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"479","name":"Emi","last":"Vago","product":"INSUMOS Y REPUESTOS","seller":"OFICINA","status":"CERRADO","eventDate":"","action":"","reason":"","comment":""},
  {"id":"480","name":"Valen","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"481","name":"","last":"","product":"OTROS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"FALTA STOCK","comment":"queria una plegadora de planos"},
  {"id":"482","name":"Jean","last":"Pierre Ozbek","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"483","name":"Florencia","last":"","product":"CAMA PLANA UV","seller":"ANDREA","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":""},
  {"id":"484","name":"Martin","last":"Flamarique","product":"MESA DE CORTE","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia Martin, mi nombre es Edgardo me comunico desde Sistemas y Soluciones, me pasaron tu contacto porque estas buscando informacion del equipo Sinajet DG 2513 puede ser, la mesa de corte."},
  {"id":"485","name":"Fede","last":"","product":"DTF TEXTIL","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"486","name":"Hernán","last":"","product":"DESCONOCIDO","seller":"EDGARDO/JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Estaba buscando cama planas Mimaki/Roland"},
  {"id":"487","name":"Evangelina","last":"Valeriano","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"488","name":"Candela","last":"","product":"OTROS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"CALIDAD LEAD","comment":"Buscaba ayuda con un soft"},
  {"id":"489","name":"","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"490","name":"julyalbertoni11","last":"","product":"DTF TEXTIL","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"491","name":"thEBerNa","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"492","name":"David","last":"Acosta","product":"PLOTTER SUBLIMACION","seller":"EDGARDO","status":"ABIERTO","eventDate":"28/09","action":"RECONTACTAR","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"493","name":"","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"494","name":"Mel","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"07/09","action":"RECONTACTAR","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"497","name":"Alejandro","last":"","product":"CAMA PLANA UV","seller":"EDGARDO/JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"498","name":"Leonardo","last":"","product":"CAMA PLANA UV","seller":"ANDREA","status":"CERRADO","eventDate":"26/08","action":"","reason":"DERIVADO","comment":"Es de Mar del plata"},
  {"id":"499","name":"graficapilla","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"28/09","action":"RECONTACTAR","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"500","name":"Melisa","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"501","name":"Dan","last":"Benitez","product":"PLANCHAS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"PRECIO ALTO","comment":"Era por una plancha, ya compro en otro lado"},
  {"id":"502","name":"Matias","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"CALIDAD LEAD","comment":"Queria imprimir, lo mande a Kollias"},
  {"id":"503","name":"Tomas","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"504","name":"","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"505","name":"Ramiro","last":"Casale","product":"CAMA PLANA UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Le intereso cama plana y mesa de corte (Huenu y Sinajet)"},
  {"id":"506","name":"Gabriel","last":"Garcia","product":"PLOTTER DE CORTE","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Esta interesado en un plotter de corte de Teneth L6HK Pro"},
  {"id":"507","name":"Ezequiel","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"COORDINAR DEMO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"508","name":"Juli","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"509","name":"Jose","last":"Tacacho","product":"PLOTTER SUBLIMACION","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"510","name":"Adrian","last":"Decima","product":"IMPRESION PAPEL CORTADO","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Le intereso la riso, tiene epson y canon"},
  {"id":"512","name":"","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"555","name":"Angel","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"PRECIO ALTO","comment":"fuera de presupuesto"},
  {"id":"514","name":"Luciano","last":"","product":"MESA DE CORTE","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"515","name":"Tomás","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"516","name":"Sergio","last":"Godoy","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"517","name":"Lucia","last":"","product":"TONERS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando TONER RICOH puede ser?"},
  {"id":"518","name":"Artistica Ohana","last":"","product":"SERVICIO DE IMPRESION","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"CALIDAD LEAD","comment":"Queria imprimir"},
  {"id":"519","name":"Pelicano Pet","last":"","product":"SERVICIO DE IMPRESION","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"CALIDAD LEAD","comment":"Queria imprimir"},
  {"id":"520","name":"-","last":"","product":"SERVICIO DE IMPRESION","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"CALIDAD LEAD","comment":"Queria imprimir"},
  {"id":"521","name":"Kevin","last":"","product":"PLOTTER ECOSOLVENTE","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"522","name":"Pablo Marcet","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"523","name":"Gaby Paterno","last":"","product":"SERVICIO DE IMPRESION","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"CALIDAD LEAD","comment":"Queria Imprimir dtf uv"},
  {"id":"524","name":"Diego","last":"Egüez","product":"IMPRESION PAPEL CORTADO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"525","name":"Carlos.","last":"Cavalieri","product":"DESCONOCIDO","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"526","name":"Lucas","last":"Palav","product":"PLOTTER UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"527","name":"Hernan","last":"","product":"CAMA PLANA UV","seller":"EDGARDO/JAVIER","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"528","name":"Melina Denisse","last":"","product":"PLOTTER SUBLIMACION","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"529","name":"Ronny Vila","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"530","name":"matimonte","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"531","name":"Pancho","last":"Vilaseca","product":"CAMA PLANA UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"532","name":"Maria","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"533","name":"Mara","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"534","name":"veronica","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"535","name":"Roxana","last":"Abril","product":"DTF UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"536","name":"Pytu","last":"","product":"DESCONOCIDO","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"537","name":"Horario","last":"Rodriguez","product":"SERVICIO DE IMPRESION","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"538","name":"Paula","last":"Compras","product":"INSUMOS Y REPUESTOS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"FALTA STOCK","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"539","name":"Mariano","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"540","name":"Odontologia","last":"integral","product":"DESCONOCIDO","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"541","name":"Marcio","last":"Cendra","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hola buen dia! Soy Edgardo de Sistemas y Soluciones Digitales, me pasaron tu contacto porque estabas buscando equipos para imprimir botellas puede ser?"},
  {"id":"542","name":"Daniela","last":"","product":"INSUMOS Y REPUESTOS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"FALTA STOCK","comment":"buscaba toner de ricoh, consulte con dani no tenemos y no traemos."},
  {"id":"543","name":"B","last":"","product":"INSUMOS Y REPUESTOS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"FALTA STOCK","comment":"Buscaba unidades de imagen de c221, no hay (quedan pocas para clientes)"},
  {"id":"544","name":"Matias","last":"","product":"ALQUILER KM","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Buscaba una cotizacion por 50  mil impresiones es una distribuidora"},
  {"id":"545","name":"Betiana","last":"","product":"TONERS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"FALTA STOCK","comment":"Insumos viejos"},
  {"id":"546","name":"MARIANO","last":"","product":"INSUMOS Y REPUESTOS","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"FALTA STOCK","comment":"Insumos viejos"},
  {"id":"547","name":"Ariel","last":"Sanchez","product":"CAMA PLANA UV","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DESINTERES","comment":"Hace mas de un mes habia hecho la consulta"},
  {"id":"548","name":"FABIAN","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"549","name":"Nitsuga","last":"","product":"SERVICIO DE IMPRESION","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"CALIDAD LEAD","comment":"Quieria imprimir DTF"},
  {"id":"551","name":"Natalia (Natyyy)","last":"","product":"DTF TEXTIL","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"552","name":"Ruben (Juli)","last":"","product":"CAMA PLANA UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"553","name":"Abril","last":"Dominguez","product":"PLOTTER UV","seller":"EDGARDO","status":"ABIERTO","eventDate":"04/09","action":"SEGUIMIENTO","reason":"SEGUIMIENTO","comment":"Hola buen dia, mi nombre es Edgardo de la firma Sistemas y Soluciones. Me pasaron tu contacto porque estas buscando unos equipos graficos puede ser?"},
  {"id":"554","name":"","last":"","product":"PLOTTER ECOSOLVENTE","seller":"EDGARDO","status":"CERRADO","eventDate":"","action":"","reason":"DERIVADO","comment":"Buscaba eequipos de ecosolvente esta en mendoza"},
  {"id":"555","name":"Angel","last":"","product":"","seller":"","status":"","eventDate":"","action":"","reason":"","comment":""},
  {"id":"556","name":"Fabian","last":"","product":"","seller":"","status":"","eventDate":"","action":"","reason":"","comment":""},
  {"id":"557","name":"SIN NOMBRE (perfil con emojis)","last":"","product":"","seller":"","status":"","eventDate":"","action":"","reason":"","comment":""},
  {"id":"558","name":"R","last":"","product":"","seller":"","status":"","eventDate":"","action":"","reason":"","comment":""},
  {"id":"559","name":"Visual","last":"","product":"","seller":"","status":"","eventDate":"","action":"","reason":"","comment":""},
  {"id":"560","name":"Juan Manuel","last":"Perren","product":"","seller":"","status":"","eventDate":"","action":"","reason":"","comment":""}
];
const normalizeSeller=(value:string)=>{const v=value.trim().toUpperCase();if(v==="OFICINA"||v.startsWith("EDGARDO/"))return "EDGARDO";return value.trim()||"SIN ASIGNAR";};
const cleanReason=(value:string)=>value.trim()||"SIN MOTIVO CARGADO";
type Lead=(typeof leads)[number];
// Colores de los motivos según la planilla (valores provisorios hasta recibir la foto con los colores exactos)
const REASON_COLORS:Record<string,string>={
  DESINTERES:"#f0919c", // rojo suave
  "PRECIO ALTO":"#c81e2e", // rojo fuerte
  "FALTA STOCK":"#f2c94c", // amarillo
  DERIVADO:"#5b9bd5", // azul
  "CALIDAD LEAD":"#a78bfa", // violeta
  SEGUIMIENTO:"#2fb98a", // verde claro
  CONCRETADO:"#178a5b", // verde
  "SIN MOTIVO CARGADO":"#c3cdd9", // gris
};
const reasonColor=(r:string)=>REASON_COLORS[r]??"#c3cdd9";
const fullName=(l:Lead)=>[l.name,l.last].filter(Boolean).join(" ").trim();
const contactHistory=(l:Lead)=>leads.filter(x=>fullName(x).toUpperCase()===fullName(l).toUpperCase()).sort((a,b)=>Number(a.id)-Number(b.id));
export default function Home(){
 const [selectedDate,setSelectedDate]=useState("04/09");
 const [selectedLead,setSelectedLead]=useState<Lead|null>(null);
 const closed=leads.filter(l=>l.status==="CERRADO").length, open=leads.filter(l=>l.status==="ABIERTO").length;
 const reasons=useMemo(()=>Object.entries(leads.filter(l=>l.status==="CERRADO").reduce<Record<string,number>>((a,l)=>{const r=cleanReason(l.reason);a[r]=(a[r]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1]),[]);
 const reasonTotal=reasons.reduce((a,[,c])=>a+c,0);
 const chartData=reasons.map(([name,value])=>({name,value,color:reasonColor(name)}));
 const dates=useMemo(()=>Array.from(new Set(leads.map(l=>l.eventDate).filter(Boolean))),[]);
 const events=useMemo(()=>leads.filter(l=>l.eventDate===selectedDate&&l.action),[selectedDate]);
 const grouped=useMemo(()=>Object.entries(events.reduce<Record<string,typeof events>>((a,l)=>{const s=normalizeSeller(l.seller);(a[s]??=[]).push(l);return a;},{})),[events]);
 return <main className="workspace"><header className="workspace-header"><div><p className="eyebrow">LEADS VENTAS / SEGUIMIENTO</p><h1>Control comercial</h1></div><div className="sync-badge"><i/> Datos del Sheet · actualizado</div></header>
 <section className="metrics"><Metric icon={<Users size={18}/>} label="Contactos" value={leads.length.toString()} note="contactos cargados" tone="blue"/><Metric icon={<BarChart3 size={18}/>} label="Caídos" value={closed.toString()} note="estado CERRADO" tone="red"/><Metric icon={<CheckCircle2 size={18}/>} label="Abiertos" value={open.toString()} note="requieren seguimiento" tone="green"/><Metric icon={<CalendarDays size={18}/>} label="Eventos del día" value={events.length.toString()} note={selectedDate} tone="orange"/></section>
 <section className="stack">
  <article className="panel reasons-panel">
   <div className="panel-head">
    <div><h2>Motivos de caídos</h2><p>Columna U · registros CERRADOS · {reasonTotal} contactos</p></div>
   </div>
   {chartData.length===0?<div className="empty-events">Sin motivos cargados.</div>:(
   <div className="reason-layout">
    <div className="reason-chart-wrap">
     <div className="donut-center"><strong>{reasonTotal}</strong><span>caídos</span></div>
     <ResponsiveContainer width="100%" height={250}>
      <PieChart>
       <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={2} strokeWidth={2} stroke="#fff">
        {chartData.map((d,i)=><Cell key={i} fill={d.color} />)}
       </Pie>
       <Tooltip contentStyle={{borderRadius:10,border:"1px solid #e8edf3",fontSize:12}} formatter={(value,name)=>[`${value} contactos`,name]} />
      </PieChart>
     </ResponsiveContainer>
    </div>
    <div className="legend-list">
     {chartData.map(d=>(
      <div className="legend-item" key={d.name}>
       <i style={{background:d.color}} />
       <span className="legend-name">{d.name}</span>
       <b>{d.value}</b>
       <em>{Math.round((d.value/reasonTotal)*100)}%</em>
      </div>
     ))}
    </div>
   </div>)}
  </article>
  <article className="panel event-panel">
   <div className="panel-head">
    <div><h2>Eventos del día</h2><p>Hacé clic en un contacto para ver su historial</p></div>
    <select className="date-select" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)}>{dates.map(d=><option key={d}>{d}</option>)}</select>
   </div>
   {grouped.length===0?<div className="empty-events">No hay acciones cargadas para esta fecha.</div>:<div className="event-groups">{grouped.map(([seller,items])=><div className="event-group" key={seller}><div className="group-title"><span className="seller-dot"/><h3>{seller}</h3><em>{items.length} evento{items.length===1?"":"s"} · clic para historial</em></div>{items.map(l=><div className="event-card is-click" key={l.id} role="button" tabIndex={0} onClick={()=>setSelectedLead(l)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setSelectedLead(l);}}}><div className="event-date">{l.eventDate}</div><div className="event-main"><b>{fullName(l)||"Sin nombre"}</b><span>{l.product||"Línea no asignada"}</span><small><strong>Acción:</strong> {l.action||"—"}</small>{l.comment&&<small><strong>Comentario ventas:</strong> {l.comment}</small>}</div><div className="event-id">#{l.id}</div></div>)}</div>)}</div>}
  </article>
  {selectedLead&&<ContactHistoryModal lead={selectedLead} history={contactHistory(selectedLead)} onClose={()=>setSelectedLead(null)} />}
 </section>
 </main>;
}
function Metric({icon,label,value,note,tone}:{icon:React.ReactNode;label:string;value:string;note:string;tone:string}){return <div className="metric"><div className={"metric-icon "+tone}>{icon}</div><div className="metric-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>}
function ContactHistoryModal({lead,history,onClose}:{lead:Lead;history:Lead[];onClose:()=>void}){
 return (
  <div className="modal-backdrop" onClick={onClose} role="presentation">
   <div className="contact-modal" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}>
    <div className="modal-head">
     <div>
      <span className="modal-eyebrow">Historial del contacto</span>
      <h3>{fullName(lead)||"Sin nombre"}</h3>
      <p>Registro #{lead.id} · vendedor {normalizeSeller(lead.seller)}</p>
     </div>
     <button className="modal-close" onClick={onClose} aria-label="Cerrar historial"><X size={16}/></button>
    </div>
    <div className="meta-grid">
     <div className="meta-box"><small>Producto consultado</small><b>{lead.product||"—"}</b></div>
     <div className="meta-box"><small>Estado actual</small><span className={"status-chip "+(lead.status==="CERRADO"?"closed":"open")}>{lead.status||"—"}</span></div>
     <div className="meta-box"><small>Última acción</small><b>{lead.action||"—"}</b></div>
     <div className="meta-box"><small>Motivo</small><span className="reason-chip"><i style={{background:reasonColor(cleanReason(lead.reason))}}/>{cleanReason(lead.reason)}</span></div>
    </div>
    <div className="history-head"><h4>Conversaciones / seguimientos</h4><em>{history.length} registro{history.length===1?"":"s"}</em></div>
    <div className="history-list">
     {history.map((h,idx)=>(
      <div className="history-item" key={h.id+"-"+idx}>
       <div className="history-top"><span className={"status-dot "+(h.status==="CERRADO"?"closed":"open")}/><b>{h.eventDate||"Sin fecha"}</b><span className="history-action">{h.action||"REGISTRO"}</span><em>#{h.id}</em></div>
       <p className="history-comment">{h.comment||"Sin comentario cargado."}</p>
       {h.status==="ABIERTO"&&<p className="history-open">Contacto ABIERTO — requiere seguimiento.</p>}
      </div>
     ))}
    </div>
   </div>
  </div>
 );
}


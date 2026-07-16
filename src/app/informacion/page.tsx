import BottomNav from "@/components/navigation/BottomNav";

export default function Informacion() {

  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">


      <h1 className="text-3xl font-bold text-slate-800">
        ℹ️ Información
      </h1>



      <div className="mt-8 rounded-3xl bg-white p-6 shadow">



        {/* DESCRIPCIÓN */}

        <div className="rounded-2xl bg-amber-50 p-5">


          <p className="font-bold">
            Descripción de la aplicación:
          </p>


          <p className="mt-3 text-slate-700">

            Se trata de una aplicación desarrollada de manera altruista,
            cuyo único objetivo es facilitar la organización y coordinación
            de los turnos de vacaciones entre los funcionarios.

            Esta herramienta tiene carácter meramente organizativo y de apoyo,
            con la finalidad de mejorar la comunicación y planificación interna,
            sin sustituir en ningún caso los procedimientos establecidos ni las
            autorizaciones correspondientes.

          </p>


        </div>





        {/* NORMAS */}

        <div className="mt-6 rounded-2xl bg-amber-50 p-5">


          <p className="font-bold">
            Normas para la solicitud de días:
          </p>



          <p className="mt-4 text-slate-700">


            1. Por orden de la superioridad,{" "}

            <strong>
              NO SE CONCEDERÁ NINGÚN DÍA QUE NO TENGA EL PERMISO DEL OFICIAL
            </strong>
            .


          </p>



          <p className="mt-3 text-slate-700">

            Cada funcionario solicitará los días correspondientes a
            través de esta plataforma y del grupo de WhatsApp creado
            a tal efecto, quedando pendiente de la correspondiente
            autorización.

          </p>




          <p className="mt-5 text-slate-700">


            2. Si alguien solicita días a través de la aplicación del
            portal de la Policía, sin haberlo solicitado previamente
            en el chat de WhatsApp, la responsabilidad será
            exclusivamente suya.


          </p>




          <p className="mt-5 text-slate-700">


            3. Para conocer los días deberá existir siempre un mínimo de{" "}

            <strong>
              11 FUNCIONARIOS TRABAJANDO
            </strong>
            , contando para ello:

            {" "}

            <strong>
              GAC
            </strong>
            ,{" "}

            <strong>
              SALA
            </strong>
            y{" "}

            <strong>
              SEGURIDAD
            </strong>
            , según orden de la superioridad.


          </p>



        </div>





        <p className="mt-8 text-sm text-slate-400">
          Versión 1.0
        </p>



      </div>





      <BottomNav />


    </main>

  );

}
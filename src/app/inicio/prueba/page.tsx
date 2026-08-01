"use client";

export default function PruebaFechas() {

  const fechas = [
    {
      fecha: "12 agosto 2026",
      gac: 8,
      seguridad: 4,
      sala: 2,
    },
    {
      fecha: "18 agosto 2026",
      gac: 10,
      seguridad: 6,
      sala: 3,
    },
    {
      fecha: "25 agosto 2026",
      gac: 7,
      seguridad: 5,
      sala: 4,
    },
  ];


  return (

    <main className="min-h-screen bg-slate-100 p-4 pb-20">


      <div
        className="
          rounded-3xl
          border
          border-red-200
          bg-red-50
          p-4
          shadow
        "
      >


        <h2 className="mb-3 text-lg font-bold text-red-900">
          🚨 Fechas conflictivas
        </h2>



        <div className="space-y-2">


          {fechas.map((f) => (

            <button
              key={f.fecha}
              className="
                w-full
                rounded-2xl
                bg-red-100
                p-3
                shadow-sm
                transition
                active:scale-95
              "
            >


              {/* FECHA */}

              <div
                className="
                  border-y
                  border-red-200
                  py-1.5
                  text-center
                "
              >

                <p className="text-base font-bold text-slate-800">
                  {f.fecha}
                </p>

              </div>



              {/* DATOS */}

              <div
                className="
                  mt-2
                  grid
                  grid-cols-3
                  text-center
                "
              >

                <div>
                  <p className="text-xs text-slate-500">
                    🚓 GAC <span className="font-bold text-slate-800">{f.gac}</span>
                  </p>
                </div>


                <div className="border-x border-red-200">
                  <p className="text-xs text-slate-500">
                    🛡️ Seguridad <span className="font-bold text-slate-800">{f.seguridad}</span>
                  </p>
                </div>


                <div>
                  <p className="text-xs text-slate-500">
                    🖥️ Sala <span className="font-bold text-slate-800">{f.sala}</span>
                  </p>
                </div>


              </div>


            </button>


          ))}


        </div>


      </div>


    </main>

  );

}
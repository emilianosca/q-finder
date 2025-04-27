import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen bg-gray-50 w-screen ">
      <div className="flex px-8 py-24 mx-auto md:px-12 lg:px-24 max-w-7xl text-base-500 items-center justify-center align-middle">
        <div className="space-y-3">
          <small className="text-base">404</small>

          <h2 className="text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
            Ups! no se encontró esta pagína
          </h2>

          <div className="flex flex-row space-x-1 text-base-500 order-first text-base font-medium">
            <p>No te preocupes, puedes</p>
            <Link href="/" className="underline">
              regresar al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

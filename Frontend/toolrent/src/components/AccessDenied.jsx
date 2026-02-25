import { ShieldOff } from "lucide-react";
import { Card, CardContent } from "./ui/card";

/**
 * Pantalla de acceso denegado para secciones restringidas por rol.
 * Se muestra cuando el usuario autenticado no tiene el rol necesario.
 */
export function AccessDenied({ section }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full shadow-lg border-red-100">
                <CardContent className="flex flex-col items-center text-center py-14 px-8 gap-5">
                    <div className="p-4 bg-red-50 rounded-full mt-6">
                        <ShieldOff className="h-10 w-10 text-black-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Acceso restringido
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            No tienes permisos para ver esta sección.
                            {section && (
                                <>
                                </>
                            )}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

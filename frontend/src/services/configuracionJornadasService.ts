import ConfiguracionJornadasService from './configuracion-jornadas.service';
export * from './configuracion-jornadas.service';

// Wrapper para compatibilidad con el componente
const configuracionJornadasService = {
  obtenerConfiguracionActiva: () => ConfiguracionJornadasService.obtenerConfiguracionActiva(),
  crearConfiguracion: (data: any) => ConfiguracionJornadasService.crearConfiguracion(data),
  actualizarConfiguracion: (id: number, data: any) => ConfiguracionJornadasService.actualizarConfiguracion(id, data)
};

export default configuracionJornadasService;

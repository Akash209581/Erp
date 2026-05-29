import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Dependencies,
} from '@nestjs/common';
import { TransportationService } from './transportation.service.js';

@Controller('transport')
@Dependencies(TransportationService)
export class TransportationController {
  constructor(transportationService) {
    this.transportationService = transportationService;
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', time: new Date().toISOString(), message: 'Transportation backend is reachable!' };
  }

  // ======================== DRIVER ENDPOINTS ========================
  @Post('drivers')
  async createDriver(@Body() createDriverDto) {
    const driver = await this.transportationService.createDriver(createDriverDto);
    return {
      statusCode: 201,
      message: 'Driver created successfully',
      data: driver,
    };
  }

  @Get('drivers')
  async getAllDrivers() {
    const drivers = await this.transportationService.getAllDrivers();
    return {
      statusCode: 200,
      message: 'Drivers retrieved successfully',
      data: drivers,
    };
  }

  @Get('drivers/:id')
  async getDriverById(@Param('id') id) {
    const driver = await this.transportationService.getDriverById(id);
    return {
      statusCode: 200,
      message: 'Driver retrieved successfully',
      data: driver,
    };
  }

  @Put('drivers/:id')
  async updateDriver(@Param('id') id, @Body() updateDriverDto) {
    const driver = await this.transportationService.updateDriver(id, updateDriverDto);
    return {
      statusCode: 200,
      message: 'Driver updated successfully',
      data: driver,
    };
  }

  @Delete('drivers/:id')
  async deleteDriver(@Param('id') id) {
    await this.transportationService.deleteDriver(id);
    return {
      statusCode: 200,
      message: 'Driver deleted successfully',
    };
  }

  // ======================== ROUTE ENDPOINTS ========================
  @Post('routes')
  async createRoute(@Body() createRouteDto) {
    const route = await this.transportationService.createRoute(createRouteDto);
    return {
      statusCode: 201,
      message: 'Route created successfully',
      data: route,
    };
  }

  @Get('routes')
  async getAllRoutes() {
    const routes = await this.transportationService.getAllRoutes();
    return {
      statusCode: 200,
      message: 'Routes retrieved successfully',
      data: routes,
    };
  }

  @Get('routes/:id')
  async getRouteById(@Param('id') id) {
    const route = await this.transportationService.getRouteById(id);
    return {
      statusCode: 200,
      message: 'Route retrieved successfully',
      data: route,
    };
  }

  @Put('routes/:id')
  async updateRoute(@Param('id') id, @Body() updateRouteDto) {
    const route = await this.transportationService.updateRoute(id, updateRouteDto);
    return {
      statusCode: 200,
      message: 'Route updated successfully',
      data: route,
    };
  }

  @Delete('routes/:id')
  async deleteRoute(@Param('id') id) {
    await this.transportationService.deleteRoute(id);
    return {
      statusCode: 200,
      message: 'Route deleted successfully',
    };
  }

  // ======================== ROUTE STOPS ENDPOINTS ========================
  @Post('routes/:id/stops')
  async addRouteStop(@Param('id') routeId, @Body() addRouteStopDto) {
    const stop = await this.transportationService.addRouteStop({
      ...addRouteStopDto,
      route_id: routeId,
    });
    return {
      statusCode: 201,
      message: 'Route stop added successfully',
      data: stop,
    };
  }

  @Get('routes/:id/stops')
  async getRouteStops(@Param('id') routeId) {
    const stops = await this.transportationService.getRouteStops(routeId);
    return {
      statusCode: 200,
      message: 'Route stops retrieved successfully',
      data: stops,
    };
  }

  @Put('stops/:id')
  async updateRouteStop(@Param('id') stopId, @Body() updateRouteStopDto) {
    const stop = await this.transportationService.updateRouteStop(
      stopId,
      updateRouteStopDto,
    );
    return {
      statusCode: 200,
      message: 'Route stop updated successfully',
      data: stop,
    };
  }

  @Delete('stops/:id')
  async deleteRouteStop(@Param('id') stopId) {
    await this.transportationService.deleteRouteStop(stopId);
    return {
      statusCode: 200,
      message: 'Route stop deleted successfully',
    };
  }

  // ======================== BUS ENDPOINTS ========================
  @Post('buses')
  async createBus(@Body() createBusDto) {
    const bus = await this.transportationService.createBus(createBusDto);
    return {
      statusCode: 201,
      message: 'Bus created successfully',
      data: bus,
    };
  }

  @Get('buses')
  async getAllBuses() {
    const buses = await this.transportationService.getAllBuses();
    return {
      statusCode: 200,
      message: 'Buses retrieved successfully',
      data: buses,
    };
  }

  @Get('buses/:id')
  async getBusById(@Param('id') id) {
    const bus = await this.transportationService.getBusById(id);
    return {
      statusCode: 200,
      message: 'Bus retrieved successfully',
      data: bus,
    };
  }

  @Put('buses/:id')
  async updateBus(@Param('id') id, @Body() updateBusDto) {
    const bus = await this.transportationService.updateBus(id, updateBusDto);
    return {
      statusCode: 200,
      message: 'Bus updated successfully',
      data: bus,
    };
  }

  @Delete('buses/:id')
  async deleteBus(@Param('id') id) {
    await this.transportationService.deleteBus(id);
    return {
      statusCode: 200,
      message: 'Bus deleted successfully',
    };
  }

  @Post('buses/assign-route')
  async assignBusToRoute(@Body() assignDto) {
    const bus = await this.transportationService.assignBusToRoute(assignDto);
    return {
      statusCode: 200,
      message: 'Bus assigned to route successfully',
      data: bus,
    };
  }

  // ======================== SEAT ALLOCATION ENDPOINTS ========================
  @Post('allocate-seat')
  async allocateSeat(@Body() allocateSeatDto) {
    const allocation = await this.transportationService.allocateSeat(allocateSeatDto);
    return {
      statusCode: 201,
      message: 'Seat allocated successfully',
      data: allocation,
    };
  }

  @Get('allocations')
  async getAllAllocations() {
    const allocations = await this.transportationService.getAllAllocationsWithRiders();
    return {
      statusCode: 200,
      message: 'Allocations retrieved successfully',
      data: allocations,
    };
  }

  @Get('user/:userId')
  async getUserAllocation(@Param('userId') userId) {
    const allocations = await this.transportationService.getUserAllocation(userId);
    return {
      statusCode: 200,
      message: 'User allocations retrieved successfully',
      data: allocations,
    };
  }

  @Get('allocations/:id')
  async getAllocationById(@Param('id') id) {
    const allocation = await this.transportationService.getAllocationById(id);
    return {
      statusCode: 200,
      message: 'Allocation retrieved successfully',
      data: allocation,
    };
  }

  @Put('allocations/:id')
  async updateAllocation(@Param('id') id, @Body() updateAllocationDto) {
    const allocation = await this.transportationService.updateAllocation(
      id,
      updateAllocationDto,
    );
    return {
      statusCode: 200,
      message: 'Allocation updated successfully',
      data: allocation,
    };
  }

  @Delete('allocations/:id')
  async deallocateSeat(@Param('id') id) {
    await this.transportationService.deallocateSeat(id);
    return {
      statusCode: 200,
      message: 'Seat deallocated successfully',
    };
  }

  // ======================== ADVANCED FEATURES ========================

  @Post('auto-allocate/:bus_id')
  async autoAllocate(@Param('bus_id') bus_id) {
    const result = await this.transportationService.autoAllocateSeats(bus_id);
    return {
      statusCode: 200,
      message: result.message,
    };
  }

  // ======================== RIDER MASTER (CSV + MANUAL) ========================

  @Get('riders')
  async getRiders(@Request() req) {
    const role = (req.query.role || '').toString();
    const riders = await this.transportationService.getRiders(role || undefined);
    return { statusCode: 200, message: 'Riders retrieved successfully', data: riders };
  }

  @Post('riders')
  async upsertRider(@Body() dto) {
    const role = (dto.role || '').toString();
    if (!['student', 'faculty'].includes(role)) {
      return { statusCode: 400, message: 'Invalid role' };
    }
    const rider = await this.transportationService.upsertRider(role, dto, dto.extra_fields || {});
    return { statusCode: 200, message: 'Rider saved', data: rider };
  }

  @Post('riders/import')
  async importRiders(@Request() req, @Body() body) {
    const role = (req.query.role || '').toString();
    if (!['student', 'faculty'].includes(role)) {
      return { statusCode: 400, message: 'Invalid role' };
    }
    const rows = Array.isArray(body?.rows) ? body.rows : [];
    const result = await this.transportationService.importRiders(role, rows);
    return { statusCode: 200, message: 'Import completed', data: result };
  }

  @Post('location/:bus_id')
  async updateLocation(
    @Param('bus_id') bus_id,
    @Body('latitude') latitude,
    @Body('longitude') longitude
  ) {
    const location = await this.transportationService.updateBusLocation(bus_id, latitude, longitude);
    return {
      statusCode: 200,
      message: 'Location updated successfully',
      data: location,
    };
  }

  // ---- Bus-NUMBER based GPS endpoints (use bus plate number, not internal ID) ----
  @Post('location/bus/:bus_number')
  async updateLocationByNumber(
    @Param('bus_number') bus_number,
    @Body('latitude') latitude,
    @Body('longitude') longitude
  ) {
    const location = await this.transportationService.updateBusLocationByNumber(bus_number, latitude, longitude);
    return {
      statusCode: 200,
      message: `Location updated for bus ${bus_number}`,
      data: location,
    };
  }

  @Get('location/bus/:bus_number')
  async getLocationByNumber(@Param('bus_number') bus_number) {
    const location = await this.transportationService.getBusLocationByNumber(bus_number);
    return {
      statusCode: 200,
      message: 'Bus location retrieved successfully',
      data: location,
    };
  }

  @Get('locations')
  async getAllLocations() {
    const locations = await this.transportationService.getAllBusLocations();
    return {
      statusCode: 200,
      message: 'Bus locations retrieved successfully',
      data: locations,
    };
  }

  @Get('location/:bus_id')
  async getBusLocation(@Param('bus_id') bus_id) {
    const location = await this.transportationService.getBusLocation(bus_id);
    return {
      statusCode: 200,
      message: 'Bus location retrieved successfully',
      data: location,
    };
  }

  @Get('user-details/:user_id/:role')
  async getUserDetails(@Param('user_id') user_id, @Param('role') role) {
    const details = await this.transportationService.getUserTransportDetail(user_id, role);
    return {
      statusCode: 200,
      message: 'User transport details retrieved successfully',
      data: details,
    };
  }

  @Post('user-details/:user_id/:role')
  async updateUserDetails(
    @Param('user_id') user_id,
    @Param('role') role,
    @Body('location') location
  ) {
    const details = await this.transportationService.updateUserTransportDetail(user_id, role, location);
    return {
      statusCode: 200,
      message: 'User transport details updated successfully',
      data: details,
    };
  }

  @Get('route-demand')
  async getRouteDemand() {
    const demand = await this.transportationService.getRouteDemand();
    return {
      statusCode: 200,
      message: 'Route demand retrieved successfully',
      data: demand,
    };
  }

  @Get('allocations/bus/:bus_id')
  async getBusAllocations(@Param('bus_id') bus_id) {
    const allocations = await this.transportationService.getBusAllocationsWithUser(bus_id);
    return {
      statusCode: 200,
      message: 'Bus allocations retrieved successfully',
      data: allocations,
    };
  }

  // ======================== DASHBOARD ENDPOINTS ========================
  @Get('dashboard/admin-stats')
  async getAdminStats() {
    const stats = await this.transportationService.getAdminDashboardStats();
    return {
      statusCode: 200,
      message: 'Admin dashboard statistics retrieved successfully',
      data: stats,
    };
  }

  @Get('dashboard/student/:userId')
  async getStudentDashboard(@Param('userId') userId) {
    const info = await this.transportationService.getStudentDashboardInfo(userId);
    return {
      statusCode: 200,
      message: 'Student dashboard information retrieved successfully',
      data: info,
    };
  }

  @Get('dashboard/faculty/:userId')
  async getFacultyDashboard(@Param('userId') userId) {
    const info = await this.transportationService.getFacultyDashboardInfo(userId);
    return {
      statusCode: 200,
      message: 'Faculty dashboard information retrieved successfully',
      data: info,
    };
  }

  @Get('buses/:id/occupancy')
  async getBusOccupancy(@Param('id') busId) {
    const occupancy = await this.transportationService.getBusOccupancy(busId);
    return {
      statusCode: 200,
      message: 'Bus occupancy retrieved successfully',
      data: occupancy,
    };
  }

  @Get('routes/utilization')
  async getRouteUtilization() {
    const utilization = await this.transportationService.getRouteUtilization();
    return {
      statusCode: 200,
      message: 'Route utilization retrieved successfully',
      data: utilization,
    };
  }

  // ======================== DOCUMENT MANAGEMENT ========================

  @Get('document-types')
  async getAllDocumentTypes() {
    const types = await this.transportationService.getAllDocumentTypes();
    return { statusCode: 200, message: 'Document types retrieved', data: types };
  }

  @Post('document-types')
  async createDocumentType(@Body() dto) {
    const type = await this.transportationService.createDocumentType(dto);
    return { statusCode: 201, message: 'Document type created', data: type };
  }

  @Delete('document-types/:id')
  async deleteDocumentType(@Param('id') id) {
    await this.transportationService.deleteDocumentType(id);
    return { statusCode: 200, message: 'Document type deleted' };
  }

  @Get('documents')
  async getAllBusDocuments() {
    const docs = await this.transportationService.getAllBusDocuments();
    return { statusCode: 200, message: 'All bus documents retrieved', data: docs };
  }

  @Get('documents/alerts')
  async getDocumentAlerts() {
    const alerts = await this.transportationService.getDocumentAlerts(5);
    return { statusCode: 200, message: 'Document alerts retrieved', data: alerts };
  }

  @Get('documents/bus/:bus_id')
  async getBusDocuments(@Param('bus_id') bus_id) {
    const docs = await this.transportationService.getBusDocuments(bus_id);
    return { statusCode: 200, message: 'Bus documents retrieved', data: docs };
  }

  @Post('documents')
  async upsertBusDocument(@Body() dto) {
    const doc = await this.transportationService.upsertBusDocument(dto);
    return { statusCode: 200, message: 'Document saved successfully', data: doc };
  }

  @Delete('documents/:id')
  async deleteBusDocument(@Param('id') id) {
    await this.transportationService.deleteBusDocument(id);
    return { statusCode: 200, message: 'Document deleted' };
  }

  // ======================== FUEL ALLOCATION ========================

  @Post('fuel')
  async createFuel(@Body() dto) {
    const entry = await this.transportationService.createFuelAllocation(dto);
    return { statusCode: 201, message: 'Fuel entry added', data: entry };
  }

  @Get('fuel/bus/:bus_id')
  async getFuelByBus(@Param('bus_id') bus_id) {
    const entries = await this.transportationService.getFuelAllocationsByBus(bus_id);
    return { statusCode: 200, message: 'Fuel entries retrieved', data: entries };
  }

  @Get('fuel/summary')
  async getFuelSummary() {
    const summary = await this.transportationService.getFuelSummary();
    return { statusCode: 200, message: 'Fuel summary retrieved', data: summary };
  }

  @Get('fuel')
  async getAllFuel() {
    const entries = await this.transportationService.getAllFuelAllocations();
    return { statusCode: 200, message: 'Fuel entries retrieved', data: entries };
  }

  // ======================== BUS BREAKDOWN ========================

  @Post('breakdowns')
  async createBreakdown(@Body() dto) {
    const entry = await this.transportationService.createBreakdown(dto);
    return { statusCode: 201, message: 'Breakdown reported', data: entry };
  }

  @Get('breakdowns')
  async getBreakdowns(@Request() req) {
    const { bus_id, status } = req.query || {};
    const entries = await this.transportationService.getBreakdowns({ bus_id, status });
    return { statusCode: 200, message: 'Breakdown logs retrieved', data: entries };
  }

  @Put('breakdowns/:id/approve')
  async approveBreakdown(@Param('id') id, @Body() body) {
    const entry = await this.transportationService.approveBreakdown(id, body?.approved_by);
    return { statusCode: 200, message: 'Breakdown approved', data: entry };
  }
}

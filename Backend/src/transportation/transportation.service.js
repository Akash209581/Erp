import { Injectable, Dependencies, NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Bus } from './entities/bus.entity.js';
import { Driver } from './entities/driver.entity.js';
import { Route } from './entities/route.entity.js';
import { RouteStop } from './entities/route-stop.entity.js';
import { TransportAllocation } from './entities/transport-allocation.entity.js';
import { UserTransportDetail } from './entities/user-transport-detail.entity.js';
import { BusLocation } from './entities/bus-location.entity.js';
import { StudentMaster } from '../students/entities/student-master.entity.js';
import { BusDocumentType } from './entities/bus-document-type.entity.js';
import { BusDocument } from './entities/bus-document.entity.js';
import { TransportRider } from './entities/transport-rider.entity.js';
import { FuelAllocation } from './entities/fuel-allocation.entity.js';
import { BusBreakdown } from './entities/bus-breakdown.entity.js';

@Injectable()
@Dependencies(
  getRepositoryToken(Bus),
  getRepositoryToken(Driver),
  getRepositoryToken(Route),
  getRepositoryToken(RouteStop),
  getRepositoryToken(TransportAllocation),
  getRepositoryToken(UserTransportDetail),
  getRepositoryToken(BusLocation),
  getRepositoryToken(StudentMaster),
  getRepositoryToken(BusDocumentType),
  getRepositoryToken(BusDocument),
  getRepositoryToken(TransportRider),
  getRepositoryToken(FuelAllocation),
  getRepositoryToken(BusBreakdown),
)
export class TransportationService {
  constructor(
    busRepository,
    driverRepository,
    routeRepository,
    routeStopRepository,
    allocationRepository,
    userTransportDetailRepository,
    busLocationRepository,
    studentMasterRepository,
    busDocumentTypeRepository,
    busDocumentRepository,
    transportRiderRepository,
    fuelAllocationRepository,
    busBreakdownRepository,
  ) {
    this.busRepository = busRepository;
    this.driverRepository = driverRepository;
    this.routeRepository = routeRepository;
    this.routeStopRepository = routeStopRepository;
    this.allocationRepository = allocationRepository;
    this.userTransportDetailRepository = userTransportDetailRepository;
    this.busLocationRepository = busLocationRepository;
    this.studentMasterRepository = studentMasterRepository;
    this.busDocumentTypeRepository = busDocumentTypeRepository;
    this.busDocumentRepository = busDocumentRepository;
    this.transportRiderRepository = transportRiderRepository;
    this.fuelAllocationRepository = fuelAllocationRepository;
    this.busBreakdownRepository = busBreakdownRepository;
  }

  normalizeKey(key) {
    return String(key || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  parseYesNo(value) {
    if (value === undefined || value === null) return null;
    const normalized = String(value).trim().toLowerCase();
    if (['yes', 'y', 'true', '1'].includes(normalized)) return true;
    if (['no', 'n', 'false', '0'].includes(normalized)) return false;
    return null;
  }

  mapStudentRow(row) {
    const mapped = {};
    const extra = {};

    const map = {
      name: 'name',
      regno: 'person_id',
      gender: 'gender',
      year: 'year',
      section: 'section',
      graduation: 'graduation',
      branch: 'branch',
      program: 'program',
      stopname: 'stop_name',
      route: 'route_name',
      busfeespaidyesno: 'bus_fees_paid',
      academicyear: 'academic_year',
    };

    Object.entries(row || {}).forEach(([key, value]) => {
      const normalized = this.normalizeKey(key);
      const field = map[normalized];
      if (field) {
        mapped[field] = field === 'bus_fees_paid' ? this.parseYesNo(value) : value;
      } else {
        extra[key] = value;
      }
    });

    return { mapped, extra };
  }

  mapStaffRow(row) {
    const mapped = {};
    const extra = {};

    const map = {
      name: 'name',
      staffid: 'person_id',
      employeeid: 'person_id',
      empid: 'person_id',
      staffno: 'person_id',
      id: 'person_id',
      designation: 'designation',
      gender: 'gender',
      qualification: 'qualification',
      dept: 'dept',
      stopname: 'stop_name',
      busfeespaidyesno: 'bus_fees_paid',
    };

    Object.entries(row || {}).forEach(([key, value]) => {
      const normalized = this.normalizeKey(key);
      const field = map[normalized];
      if (field) {
        mapped[field] = field === 'bus_fees_paid' ? this.parseYesNo(value) : value;
      } else {
        extra[key] = value;
      }
    });

    return { mapped, extra };
  }

  async upsertRider(role, data, extra_fields) {
    const person_id = String(data.person_id || '').trim();
    if (!person_id) throw new BadRequestException('person_id is required');

    let route_id = data.route_id ?? null;
    if (!route_id && data.route_name) {
      const route = await this.routeRepository.findOne({
        where: { route_name: String(data.route_name).trim() },
      });
      route_id = route?.route_id ?? null;
    }

    const payload = {
      ...data,
      person_id,
      role,
      route_id,
      extra_fields: Object.keys(extra_fields || {}).length ? extra_fields : null,
    };

    const existing = await this.transportRiderRepository.findOne({
      where: { person_id, role },
    });

    if (existing) {
      await this.transportRiderRepository.update({ person_id, role }, payload);
      return await this.transportRiderRepository.findOne({ where: { person_id, role } });
    }

    const rider = this.transportRiderRepository.create(payload);
    return await this.transportRiderRepository.save(rider);
  }

  async importRiders(role, rows) {
    const results = { created: 0, updated: 0, errors: [] };
    for (const row of rows || []) {
      try {
        const { mapped, extra } = role === 'student' ? this.mapStudentRow(row) : this.mapStaffRow(row);
        const existing = await this.transportRiderRepository.findOne({
          where: { person_id: String(mapped.person_id || '').trim(), role },
        });
        await this.upsertRider(role, mapped, extra);
        if (existing) {
          results.updated += 1;
        } else {
          results.created += 1;
        }
      } catch (error) {
        results.errors.push({ row, error: error.message });
      }
    }
    return results;
  }

  async getRiders(role) {
    const where = role ? { role } : {};
    return await this.transportRiderRepository.find({ where, order: { person_id: 'ASC' } });
  }

  // ======================== FUEL ALLOCATION ========================

  async createFuelAllocation(dto) {
    const { bus_id, amount, liters, odometer_km, notes } = dto;

    if (!bus_id || amount === undefined || liters === undefined || odometer_km === undefined) {
      throw new BadRequestException('bus_id, amount, liters, and odometer_km are required');
    }

    const bus = await this.getBusById(bus_id);
    if (!bus) throw new NotFoundException('Bus not found');

    const allocation = this.fuelAllocationRepository.create({
      bus_id: Number(bus_id),
      amount: Number(amount),
      liters: Number(liters),
      odometer_km: Number(odometer_km),
      notes: notes || null,
    });

    return await this.fuelAllocationRepository.save(allocation);
  }

  buildFuelStats(entries) {
    const sorted = [...entries].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return sorted.map((entry, index) => {
      const previous = sorted[index + 1];
      const prevPrev = sorted[index + 2];

      const delta_km = previous
        ? Number(entry.odometer_km) - Number(previous.odometer_km)
        : null;

      // Mileage uses previous entry liters (per requirement)
      const mileage = delta_km !== null && previous && Number(previous.liters) > 0
        ? Number((delta_km / Number(previous.liters)).toFixed(2))
        : null;

      // Previous mileage uses previous delta / previous-previous liters
      let prev_mileage = null;
      if (previous && prevPrev && Number(prevPrev.liters) > 0) {
        const prevDelta = Number(previous.odometer_km) - Number(prevPrev.odometer_km);
        prev_mileage = Number((prevDelta / Number(prevPrev.liters)).toFixed(2));
      }

      return {
        ...entry,
        delta_km,
        mileage,
        previous_mileage: prev_mileage,
      };
    });
  }

  async getFuelAllocationsByBus(bus_id) {
    const entries = await this.fuelAllocationRepository.find({
      where: { bus_id: Number(bus_id) },
      relations: ['bus'],
      order: { created_at: 'DESC' },
    });
    return this.buildFuelStats(entries);
  }

  async getAllFuelAllocations() {
    const entries = await this.fuelAllocationRepository.find({
      relations: ['bus'],
      order: { created_at: 'DESC' },
    });
    return this.buildFuelStats(entries);
  }

  // ======================== BUS BREAKDOWN ========================

  async createBreakdown(dto) {
    const { bus_id, part, note, priority, reported_by } = dto;
    if (!bus_id || !part) throw new BadRequestException('bus_id and part are required');

    await this.getBusById(bus_id);

    const breakdown = this.busBreakdownRepository.create({
      bus_id: Number(bus_id),
      part: String(part).trim(),
      note: note ? String(note).trim() : null,
      priority: priority || 'medium',
      status: 'reported',
      reported_by: reported_by ? String(reported_by).trim() : null,
    });

    return await this.busBreakdownRepository.save(breakdown);
  }

  async approveBreakdown(id, approved_by) {
    const breakdown = await this.busBreakdownRepository.findOne({ where: { id: Number(id) } });
    if (!breakdown) throw new NotFoundException('Breakdown not found');

    breakdown.status = 'approved';
    breakdown.approved_by = approved_by ? String(approved_by).trim() : null;
    breakdown.approved_at = new Date();
    return await this.busBreakdownRepository.save(breakdown);
  }

  async getBreakdowns(filters = {}) {
    const where = {};
    if (filters.bus_id) where.bus_id = Number(filters.bus_id);
    if (filters.status) where.status = String(filters.status);

    return await this.busBreakdownRepository.find({
      where,
      relations: ['bus'],
      order: { reported_at: 'DESC' },
    });
  }

  async getFuelSummary() {
    const entries = await this.fuelAllocationRepository.find({
      relations: ['bus'],
      order: { created_at: 'DESC' },
    });

    const grouped = new Map();
    entries.forEach((entry) => {
      const key = entry.bus_id;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(entry);
    });

    const summary = [];
    grouped.forEach((busEntries, busId) => {
      const stats = this.buildFuelStats(busEntries);
      const totalLiters = stats.reduce((sum, e) => sum + Number(e.liters || 0), 0);
      const totalAmount = stats.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      const mileageEntries = stats.filter((e) => e.mileage !== null);
      const avgMileage = mileageEntries.length
        ? Number((mileageEntries.reduce((sum, e) => sum + Number(e.mileage), 0) / mileageEntries.length).toFixed(2))
        : null;

      summary.push({
        bus_id: busId,
        bus_number: busEntries[0]?.bus?.bus_number || String(busId),
        total_liters: Number(totalLiters.toFixed(2)),
        total_amount: Number(totalAmount.toFixed(2)),
        avg_mileage: avgMileage,
      });
    });

    return summary.sort((a, b) => a.bus_number.localeCompare(b.bus_number));
  }

  // ======================== DRIVER MANAGEMENT ========================
  async createDriver(createDriverDto) {
    const driver = this.driverRepository.create(createDriverDto);
    return await this.driverRepository.save(driver);
  }

  async getAllDrivers() {
    return await this.driverRepository.find();
  }

  async getDriverById(driver_id) {
    const driver = await this.driverRepository.findOne({ where: { driver_id } });
    if (!driver) throw new NotFoundException('Driver not found');
    return driver;
  }

  async updateDriver(driver_id, updateDriverDto) {
    await this.getDriverById(driver_id);
    await this.driverRepository.update(driver_id, updateDriverDto);
    return await this.getDriverById(driver_id);
  }

  async deleteDriver(driver_id) {
    await this.getDriverById(driver_id);
    return await this.driverRepository.delete(driver_id);
  }

  // ======================== ROUTE MANAGEMENT ========================
  async createRoute(createRouteDto) {
    const route = this.routeRepository.create(createRouteDto);
    return await this.routeRepository.save(route);
  }

  async getAllRoutes() {
    return await this.routeRepository.find({ relations: ['stops'] });
  }

  async getRouteById(route_id) {
    const route = await this.routeRepository.findOne({
      where: { route_id },
      relations: ['stops'],
    });
    if (!route) throw new NotFoundException('Route not found');
    return route;
  }

  async updateRoute(route_id, updateRouteDto) {
    await this.getRouteById(route_id);
    await this.routeRepository.update(route_id, updateRouteDto);
    return await this.getRouteById(route_id);
  }

  async deleteRoute(route_id) {
    await this.getRouteById(route_id);
    return await this.routeRepository.delete(route_id);
  }

  // ======================== ROUTE STOPS MANAGEMENT ========================
  async addRouteStop(addRouteStopDto) {
    const stop = this.routeStopRepository.create(addRouteStopDto);
    return await this.routeStopRepository.save(stop);
  }

  async getRouteStops(route_id) {
    return await this.routeStopRepository.find({
      where: { route_id },
      order: { stop_order: 'ASC' },
    });
  }

  async updateRouteStop(stop_id, updateRouteStopDto) {
    await this.routeStopRepository.update(stop_id, updateRouteStopDto);
    return await this.routeStopRepository.findOne({ where: { stop_id } });
  }

  async deleteRouteStop(stop_id) {
    return await this.routeStopRepository.delete(stop_id);
  }

  // ======================== BUS MANAGEMENT ========================
  async createBus(createBusDto) {
    const bus = this.busRepository.create(createBusDto);
    return await this.busRepository.save(bus);
  }

  async getAllBuses() {
    return await this.busRepository.find();
  }

  async getBusById(bus_id) {
    const bus = await this.busRepository.findOne({ where: { bus_id } });
    if (!bus) throw new NotFoundException('Bus not found');
    return bus;
  }

  async updateBus(bus_id, updateBusDto) {
    await this.getBusById(bus_id);
    await this.busRepository.update(bus_id, updateBusDto);
    return await this.getBusById(bus_id);
  }

  async deleteBus(bus_id) {
    await this.getBusById(bus_id);
    return await this.busRepository.delete(bus_id);
  }

  async assignBusToRoute(assignDto) {
    const { bus_id, route_id, driver_id } = assignDto;
    const bus = await this.getBusById(bus_id);
    bus.route_id = route_id;
    bus.driver_id = driver_id;
    return await this.busRepository.save(bus);
  }

  // ======================== SEAT ALLOCATION ========================
  async allocateSeat(allocateSeatDto) {
    const { user_id, role, bus_id, seat_number } = allocateSeatDto;

    // Validate transport eligibility if it's a student
    if (role === 'student') {
        const student = await this.studentMasterRepository.findOne({ 
            where: { id: user_id } 
        });
        
        if (!student) {
            throw new NotFoundException(`Student with ID ${user_id} not found`);
        }

        if (!student.isTransport) {
            throw new BadRequestException('Student is not registered for transportation');
        }
    }

    // Check if seat is already occupied
    const existing = await this.allocationRepository.findOne({
      where: { bus_id, seat_number, status: 'active' },
    });
    if (existing) throw new BadRequestException('Seat already allocated');

    // Check bus capacity
    const bus = await this.getBusById(bus_id);
    const activeAllocations = await this.allocationRepository.count({
      where: { bus_id, status: 'active' },
    });
    if (activeAllocations >= bus.capacity) {
      throw new BadRequestException('Bus is at full capacity');
    }

    const allocation = this.allocationRepository.create({
      ...allocateSeatDto,
      status: 'active',
    });
    return await this.allocationRepository.save(allocation);
  }

  async getAllAllocations() {
    return await this.allocationRepository.find();
  }

  async getAllAllocationsWithRiders() {
    const allocations = await this.allocationRepository.find();
    if (!allocations.length) return [];

    const riderKeys = allocations.map((a) => ({ person_id: a.user_id, role: a.role }));
    const riders = await this.transportRiderRepository.find({
      where: riderKeys,
    });

    return allocations.map((allocation) => {
      const rider = riders.find(
        (r) => r.person_id === allocation.user_id && r.role === allocation.role,
      );
      return { ...allocation, rider: rider || null };
    });
  }

  async getUserAllocation(user_id) {
    return await this.allocationRepository.find({
      where: { user_id },
    });
  }

  async getAllocationById(allocation_id) {
    const allocation = await this.allocationRepository.findOne({
      where: { allocation_id },
    });
    if (!allocation) throw new NotFoundException('Allocation not found');
    return allocation;
  }

  async updateAllocation(allocation_id, updateAllocationDto) {
    await this.getAllocationById(allocation_id);
    await this.allocationRepository.update(allocation_id, updateAllocationDto);
    return await this.getAllocationById(allocation_id);
  }

  async deallocateSeat(allocation_id) {
    await this.getAllocationById(allocation_id);
    return await this.allocationRepository.delete(allocation_id);
  }

  // ======================== DASHBOARD ANALYTICS ========================
  async getAdminDashboardStats() {
    const [buses, drivers, routes, allocations] = await Promise.all([
      this.busRepository.count(),
      this.driverRepository.count(),
      this.routeRepository.count(),
      this.allocationRepository.count({ where: { status: 'active' } }),
    ]);

    const studentAllocations = await this.allocationRepository.count({
      where: { role: 'student', status: 'active' },
    });

    const facultyAllocations = await this.allocationRepository.count({
      where: { role: 'faculty', status: 'active' },
    });

    return {
      totalBuses: buses,
      totalDrivers: drivers,
      totalRoutes: routes,
      totalAllocations: allocations,
      totalStudents: studentAllocations,
      totalFaculty: facultyAllocations,
    };
  }

  async getStudentDashboardInfo(user_id) {
    if (!user_id) return null;
    const normalizedUserId = String(user_id).trim().toUpperCase();

    // user_id can be username (registration number) OR integer id
    // Try exact match first with normalized uppercase
    let allocation = await this.allocationRepository.findOne({
      where: { user_id: normalizedUserId, role: 'student', status: 'active' },
    });

    if (!allocation) {
      allocation = await this.allocationRepository.findOne({
        where: { user_id: String(user_id).trim(), role: 'student', status: 'active' },
      });
    }

    // If not found by passed value, also check users table to get username and retry
    if (!allocation) {
      try {
        const userRows = await this.allocationRepository.manager.query(
          `SELECT username FROM users WHERE id = $1 OR username ILIKE $2 LIMIT 1`,
          [isNaN(Number(user_id)) ? 0 : Number(user_id), String(user_id).trim()]
        );
        if (userRows.length > 0) {
          const username = userRows[0].username;
          allocation = await this.allocationRepository.findOne({
            where: { user_id: username, role: 'student', status: 'active' },
          });
        }
      } catch (e) {
        console.warn('Could not cross-reference user_id with users table:', e.message);
      }
    }

    if (!allocation) return null;

    let bus = null;
    try {
      bus = await this.getBusById(allocation.bus_id);
      // Include driver info if bus has a driver
      if (bus && bus.driver_id) {
        try {
          bus.driver = await this.getDriverById(bus.driver_id);
        } catch(e) {}
      }
    } catch(e) {
      console.warn('Bus not found for allocation');
    }

    let route = null;
    let stops = [];
    if (allocation.route_id) {
      try {
        route = await this.getRouteById(allocation.route_id);
        stops = await this.getRouteStops(allocation.route_id);
      } catch (e) {
        console.warn('Route not found for allocation', allocation.allocation_id);
      }
    }

    return {
      allocation,
      bus,
      route,
      stops,
    };
  }

  async getFacultyDashboardInfo(user_id) {
    const allocation = await this.allocationRepository.findOne({
      where: { user_id, role: 'faculty', status: 'active' },
    });

    if (!allocation) return null;

    const bus = await this.getBusById(allocation.bus_id);
    const route = await this.getRouteById(allocation.route_id);

    return {
      allocation,
      bus,
      route,
    };
  }

  async getBusOccupancy(bus_id) {
    const bus = await this.getBusById(bus_id);
    const occupied = await this.allocationRepository.count({
      where: { bus_id, status: 'active' },
    });
    return {
      bus_id,
      bus_number: bus.bus_number,
      capacity: bus.capacity,
      occupied,
      available: bus.capacity - occupied,
    };
  }

  async getRouteUtilization() {
    const routes = await this.routeRepository.find();
    const utilization = await Promise.all(
      routes.map(async (route) => {
        const busCount = await this.busRepository.count({
          where: { route_id: route.route_id },
        });
        const allocationCount = await this.allocationRepository.count({
          where: { route_id: route.route_id, status: 'active' },
        });
        return {
          route_id: route.route_id,
          route_name: route.route_name,
          busCount,
          allocationCount,
        };
      }),
    );
    return utilization;
  }

  // ======================== ADVANCED FEATURES ========================

  async autoAllocateSeats(bus_id) {
    const bus = await this.getBusById(bus_id);
    if (!bus) throw new NotFoundException('Bus not found');

    const route = bus.route_id ? await this.routeRepository.findOne({ where: { route_id: bus.route_id } }) : null;
    const routeName = route?.route_name;

    const matchRoute = (rider) => {
      if (bus.route_id && rider.route_id) return rider.route_id === bus.route_id;
      if (routeName && rider.route_name) return rider.route_name === routeName;
      return true;
    };

    const riders = await this.transportRiderRepository.find({
      where: { role: 'student' },
      order: { person_id: 'ASC' },
    });

    const staffRiders = await this.transportRiderRepository.find({
      where: { role: 'faculty' },
      order: { person_id: 'ASC' },
    });

    // Clear existing allocations for this bus to reset dynamically
    await this.allocationRepository.delete({ bus_id });

    let currentSeat = 1;

    // Rule 1: Staff seats (Staff reserved seats first)
    const staffToAllocate = staffRiders.filter(matchRoute).slice(0, bus.staff_seats);
    for (const member of staffToAllocate) {
      if (currentSeat > bus.staff_seats) break;
      await this.upsertAllocation(
        member.person_id,
        'faculty',
        bus.bus_id,
        bus.route_id,
        currentSeat++,
        member.stop_name,
      );
    }

    // Reset seat to start of student block
    currentSeat = bus.staff_seats + 1;
    const girlCapacity = bus.girl_seats;
    const boyCapacity = bus.boy_seats;

    const eligibleStudents = riders.filter(matchRoute);
    const girls = eligibleStudents.filter((s) => ['female', 'f'].includes(String(s.gender || '').toLowerCase()));
    const boys = eligibleStudents.filter((s) => ['male', 'm'].includes(String(s.gender || '').toLowerCase()));

    // Rule 2: First block for Girls
    const girlsToAllocate = girls.slice(0, girlCapacity);
    for (const girl of girlsToAllocate) {
      if (currentSeat > bus.staff_seats + girlCapacity) break;
      await this.upsertAllocation(
        girl.person_id,
        'student',
        bus.bus_id,
        bus.route_id,
        currentSeat++,
        girl.stop_name,
      );
    }

    // Rule 3: End block for Boys
    currentSeat = bus.staff_seats + girlCapacity + 1;
    const boysToAllocate = boys.slice(0, boyCapacity);
    for (const boy of boysToAllocate) {
      if (currentSeat > bus.capacity) break;
      await this.upsertAllocation(
        boy.person_id,
        'student',
        bus.bus_id,
        bus.route_id,
        currentSeat++,
        boy.stop_name,
      );
    }

    return { message: 'Auto-allocation completed successfully' };
  }

    async upsertAllocation(user_id, role, bus_id, route_id, seat_number, pickup_stop) {
      const uid = typeof user_id === 'number' ? user_id : user_id.toString();
      const existing = await this.allocationRepository.findOne({
          where: { user_id: uid, role, status: 'active' }
      });

      if (existing) {
            await this.allocationRepository.update(existing.allocation_id, {
              bus_id, route_id, seat_number, pickup_stop
            });
      } else {
          const allocation = this.allocationRepository.create({
              user_id: uid,
              role,
              bus_id,
              route_id,
              seat_number,
              pickup_stop,
              status: 'active'
          });
          await this.allocationRepository.save(allocation);
      }
  }

  async updateBusLocation(bus_id, latitude, longitude) {
      let location = await this.busLocationRepository.findOne({ where: { bus_id } });
      if (location) {
          location.latitude = latitude;
          location.longitude = longitude;
          location.updated_at = new Date();
      } else {
          location = this.busLocationRepository.create({ bus_id, latitude, longitude });
      }
      return await this.busLocationRepository.save(location);
  }

  async getAllBusLocations() {
      return await this.busLocationRepository.find();
  }

  async getBusLocation(bus_id) {
      return await this.busLocationRepository.findOne({ where: { bus_id } });
  }

  // GPS apps call this with bus NUMBER (e.g. "AP07BY1234") — we look up the bus_id internally
  async updateBusLocationByNumber(bus_number, latitude, longitude) {
      const normalizedNumber = bus_number.trim().toUpperCase();
      const bus = await this.busRepository.findOne({ where: { bus_number: normalizedNumber } });
      if (!bus) throw new NotFoundException(`Bus with number "${normalizedNumber}" not found`);
      return await this.updateBusLocation(bus.bus_id, latitude, longitude);
  }

  async getBusLocationByNumber(bus_number) {
      const normalizedNumber = bus_number.trim().toUpperCase();
      const bus = await this.busRepository.findOne({ where: { bus_number: normalizedNumber } });
      if (!bus) throw new NotFoundException(`Bus with number "${normalizedNumber}" not found`);
      const location = await this.busLocationRepository.findOne({ where: { bus_id: bus.bus_id } });
      return { bus_number: normalizedNumber, bus_id: bus.bus_id, ...location };
  }

  async getUserTransportDetail(user_id, role) {
      return await this.userTransportDetailRepository.findOne({ where: { user_id, role } });
  }

  async updateUserTransportDetail(user_id, role, location) {
      let detail = await this.userTransportDetailRepository.findOne({ where: { user_id, role } });
      if (detail) {
          detail.transportation_location = location;
      } else {
          detail = this.userTransportDetailRepository.create({ user_id, role, transportation_location: location });
      }
      return await this.userTransportDetailRepository.save(detail);
  }

  async getRouteDemand() {
    try {
      const query = `
        SELECT r.route_name, COUNT(s.id) as count
        FROM "student_master" s
        LEFT JOIN "transport_allocations" a ON a.user_id = s.registerno::varchar AND a.status = 'active'
        LEFT JOIN "routes" r ON 1=1
        WHERE s."isTransport" = true AND a.allocation_id IS NULL
        GROUP BY r.route_name
      `;
      const results = await this.studentMasterRepository.query(query);
      return results;
    } catch (err) {
      console.error('getRouteDemand error:', err.message);
      return [{ route_name: 'Guntur - Campus', count: 12 }]; // Fallback
    }
  }

  async getBusAllocationsWithUser(bus_id) {
    try {
      const allocations = await this.allocationRepository.find({
          where: { bus_id, status: 'active' }
      });

      // Manually join with User table for names (simplified)
      const enriched = await Promise.all(allocations.map(async a => {
          let user = null;
          if (a.role === 'student') {
              user = await this.studentMasterRepository.findOne({ where: { registerno: a.user_id.toString() } });
          } else {
              const res = await this.allocationRepository.manager.query('SELECT first_name FROM users WHERE id = $1', [a.user_id]);
              user = res[0];
          }
          return { ...a, user };
      }));
      
      return enriched;
    } catch (err) {
      console.error('getBusAllocationsWithUser error:', err.message);
      return [];
    }
  }

  // ======================== BUS DOCUMENT MANAGEMENT ========================

  async getAllDocumentTypes() {
    return await this.busDocumentTypeRepository.find({ order: { name: 'ASC' } });
  }

  async createDocumentType(dto) {
    const existing = await this.busDocumentTypeRepository.findOne({ where: { name: dto.name } });
    if (existing) return existing;
    const docType = this.busDocumentTypeRepository.create(dto);
    return await this.busDocumentTypeRepository.save(docType);
  }

  async deleteDocumentType(id) {
    return await this.busDocumentTypeRepository.delete(id);
  }

  async getBusDocuments(bus_id) {
    return await this.busDocumentRepository.find({
      where: { bus_id: parseInt(bus_id) },
      relations: ['documentType'],
      order: { expiry_date: 'ASC' },
    });
  }

  async getAllBusDocuments() {
    return await this.busDocumentRepository.find({
      relations: ['documentType', 'bus'],
      order: { expiry_date: 'ASC' },
    });
  }

  async upsertBusDocument(dto) {
    const { bus_id, document_type_id, expiry_date, document_number, notes } = dto;

    const existing = await this.busDocumentRepository.findOne({
      where: { bus_id: parseInt(bus_id), document_type_id: parseInt(document_type_id) },
    });

    if (existing) {
      await this.busDocumentRepository.update(existing.id, {
        expiry_date,
        document_number,
        notes,
      });
      return await this.busDocumentRepository.findOne({
        where: { id: existing.id },
        relations: ['documentType', 'bus'],
      });
    } else {
      const doc = this.busDocumentRepository.create({
        bus_id: parseInt(bus_id),
        document_type_id: parseInt(document_type_id),
        expiry_date,
        document_number,
        notes,
      });
      const saved = await this.busDocumentRepository.save(doc);
      return await this.busDocumentRepository.findOne({
        where: { id: saved.id },
        relations: ['documentType', 'bus'],
      });
    }
  }

  async deleteBusDocument(id) {
    return await this.busDocumentRepository.delete(id);
  }

  async getDocumentAlerts(daysAhead = 5) {
    // Get all documents expiring within the next N days (or already expired)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    futureDate.setHours(23, 59, 59, 999);

    const docs = await this.busDocumentRepository.find({
      relations: ['documentType', 'bus'],
    });

    const alerts = docs
      .map(doc => {
        const expiry = new Date(doc.expiry_date);
        const diffMs = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return { ...doc, daysUntilExpiry: diffDays };
      })
      .filter(doc => doc.daysUntilExpiry <= daysAhead)
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

    return alerts;
  }
}

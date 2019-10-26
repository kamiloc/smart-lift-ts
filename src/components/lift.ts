import { LiftState } from "../types/lift";

export default class Lift {
  floorList: Array<number> = [];
  maxFloorNumber: number = 3;
  index: string;
  private currentFloor: number;
  private destinationFloor: number;
  private state: LiftState = LiftState.STOPPED;
  private stops: Array<number> = [];

  constructor(index: string) {
    this.index = index;
    this.setCurrentFloor(0);
  }

  getCurrentFloor(): number {
    return this.currentFloor;
  }

  setCurrentFloor(newFloor: number): void {
    this.currentFloor = newFloor;
  }

  getDestinationFloor(): number {
    return this.destinationFloor;
  }

  setDestinationFloor(newFloor: number): void {
    this.destinationFloor = newFloor;
  }

  getSate(): LiftState {
    return this.state;
  }

  setState(newState: LiftState) {
    this.state = newState;
  }

  isAvailableToAssign(): boolean {
    return this.floorList.findIndex(floor => floor === 0) > -1;
  }

  setElementToFloorList(value: number): void {
    const listIndex = this.floorList.filter(floor => floor !== 0).length;

    if (listIndex + 1 > this.maxFloorNumber) {
      console.warn(`[${this.index}] - Número máximo de pisos igual: ${this.maxFloorNumber}`);
    } else {
      this.floorList[listIndex] = value;
    }
  }

  moveOneFloor(isUpperMove?: boolean) {
    switch (this.state) {
      case LiftState.UP:
        this.setCurrentFloor(this.currentFloor + 1);
        break;
      case LiftState.DOWN:
        this.setCurrentFloor(this.currentFloor - 1);
        break;
      case LiftState.STOPPED:
        this.setState(isUpperMove ? LiftState.UP : LiftState.DOWN);
        this.setCurrentFloor(isUpperMove ? this.currentFloor + 1 : this.currentFloor - 1);
        break;
    }

    this.floorList = this.floorList.map(floor => {
      if (floor === this.currentFloor) {
        this.setState(LiftState.STOPPED);
        return 0;
      } else {
        return floor;
      }
    });
  }

  necessaryEnergy(originFloor: number, destinationFloor: number): number {
    let energy = 0;
    switch (this.state) {
      case LiftState.STOPPED:
        //arranque
        energy += 1;
        //energia nescesaria desde el piso donde esta el ascensor a el piso de origen
        energy += Math.abs(originFloor - this.currentFloor) * 0.5;
        //energia nescesaria desde el origen al piso destino
        energy += Math.abs(destinationFloor - originFloor) * 0.5;
        //parada
        energy += 1;
        break;

      case LiftState.DOWN:
        if (this.currentFloor > originFloor) {
          energy += (this.currentFloor - originFloor) * 0.5;
          for (let i = 0; i < this.stops.length; i++) {
            const element = this.stops[i];
            if (element > originFloor) energy += 1;
          }
          energy += 1;
        }
        break;

      case LiftState.UP:
        break;

      default:
        break;
    }

    return energy;
  }
}

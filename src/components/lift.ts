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
      console.warn(`[${this.index}] - Número máximo de pisos igual a: ${this.maxFloorNumber}`);
    } else {
      this.floorList[listIndex] = value;
    }
  }

  moveOneFloor(isUpperMove?: boolean, onStopMove?: VoidFunction) {
    switch (this.state) {
      case LiftState.UP:
        this.setCurrentFloor(this.currentFloor + 1);
        console.log(`Ascensor ${this.index} subiendo`);
        break;
      case LiftState.DOWN:
        this.setCurrentFloor(this.currentFloor - 1);
        console.log(`Ascensor ${this.index} bajando`);
        break;
      case LiftState.STOPPED:
        this.setState(isUpperMove ? LiftState.UP : LiftState.DOWN);
        this.setCurrentFloor(isUpperMove ? this.currentFloor + 1 : this.currentFloor - 1);
        console.log(`Ascensor ${this.index} ${isUpperMove ? "subiendo" : "bajando"}`);
        break;
    }

    this.floorList = this.floorList.map(floor => {
      if (floor === this.currentFloor) {
        this.setState(LiftState.STOPPED);
        onStopMove && onStopMove();
        return 0;
      } else {
        return floor;
      }
    });
  }

  necessaryEnergy(originFloor: number, destinationFloor: number): number {
    let energy = 2;
    switch (this.state) {
      case LiftState.STOPPED:
        //energia nescesaria desde el piso donde esta el ascensor a el piso de origen
        energy += Math.abs(originFloor - this.currentFloor) * 0.5;
        //energia nescesaria desde el origen al piso destino
        energy += Math.abs(destinationFloor - originFloor) * 0.5;
        break;

      case LiftState.DOWN:
        if (this.currentFloor > originFloor) {
          energy += (this.currentFloor - originFloor) * 0.5;
          for (let i = 0; i < this.stops.length; i++) {
            const element = this.stops[i];
            if (element > originFloor) energy += 1;
          }
        }
        if (this.currentFloor < originFloor) {
          let minFloor = this.stops.filter(x => x < originFloor)[0];
          energy += (originFloor - minFloor) * 0.5;
          for (let i = 0; i < this.stops.length; i++) {
            const element = this.stops[i];
            if (element < originFloor) energy += 1;
          }
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

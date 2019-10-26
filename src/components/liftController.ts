import Lift from "./lift";
import { LiftState } from "../types/lift";

export default class ListController {
  liftArray: Array<Lift> = [];
  private floorNumber: number;

  constructor(floor: number) {
    this.floorNumber = floor;
  }

  private orderLiftListByEnergy(liftList: Lift[], originFloor: number, destinationFloor: number) {
    return liftList.sort((a, b) => {
      if (a.necessaryEnergy(originFloor, destinationFloor) > b.necessaryEnergy(originFloor, destinationFloor)) return 1;
      if (a.necessaryEnergy(originFloor, destinationFloor) < b.necessaryEnergy(originFloor, destinationFloor)) return -1;

      return 0;
    });
  }

  getLiftInFloor(floorNumber: number): Lift {
    return this.liftArray.find(lift => lift.getCurrentFloor() === floorNumber);
  }

  searchFloor(originFloor: number, destinationFloor: number): string {
    let lift = this.getLiftInFloor(destinationFloor);

    if (lift) return lift.index;
    else {
      const isUpperRequest: boolean = destinationFloor - originFloor > 0;

      let assignableLifts: Lift[] = this.liftArray.filter(lift =>
        isUpperRequest
          ? lift.getSate() === LiftState.UP && lift.isAvailableToAssign()
          : lift.getSate() === LiftState.DOWN && lift.isAvailableToAssign()
      );

      if (assignableLifts.length) lift = this.orderLiftListByEnergy(assignableLifts, originFloor, destinationFloor)[0];
      else
        assignableLifts = this.orderLiftListByEnergy(this.liftArray, originFloor, destinationFloor).filter(lift =>
          lift.isAvailableToAssign()
        );

      if (assignableLifts.length) lift = assignableLifts[0];

      return lift.index;
    }
  }

  assignLift(liftIndex: string) {
    const selectedLift = this.liftArray.find(lift => lift.index === liftIndex);

    console.log(`Ascensor ${liftIndex} asignado al piso ${this.floorNumber}`);
    selectedLift.addElementToFloorList(this.floorNumber);
  }
}

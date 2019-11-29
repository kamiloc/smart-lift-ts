import Lift from "./lift";
import { LiftState } from "../types/lift";

export default class ListController {
  liftArray: Array<Lift> = [];
  private floorNumber: number;
  private liftsMoveTime: number = 500;

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

  searchFloor(originFloor: number, destinationFloor: number): void {
    let lift = this.getLiftInFloor(destinationFloor);

    if (lift) {
      this.assignLift(lift.index);
      lift.setDestinationFloor(destinationFloor);
      return;
    } else {
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

      this.assignLift(lift.index);
      lift.setDestinationFloor(destinationFloor);
    }
  }

  assignLift(liftIndex: string) {
    const selectedLift = this.liftArray.find(lift => lift.index === liftIndex);

    console.log(`Ascensor ${liftIndex} asignado al piso ${this.floorNumber}`);
    selectedLift.setElementToFloorList(this.floorNumber);
  }

  sendMoveSignalToLift(lift: Lift): void {
    const moveId = setInterval(() => {
      let isUpperRequest: boolean | undefined;

      if (lift.getSate() === LiftState.STOPPED) isUpperRequest = lift.getDestinationFloor() - lift.getCurrentFloor() > 0;
      lift.moveOneFloor(isUpperRequest, onStopLift.bind(null, lift));
    });

    const onStopLift = (lift: Lift): void => {
      console.log(`Ascensor ${lift.index} se detiene en el piso ${lift.getCurrentFloor()}`);
      clearInterval(moveId);
    };
  }
}

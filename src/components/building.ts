import Lift from "./lift";

export default class Building {
  lifts: Array<Lift> = [];
  floors: number;

  constructor(liftsNumber: number, floorsNumber: number) {
    this.floors = floorsNumber;
    for (let i = 0; i < liftsNumber; i++) {
      this.lifts.push(new Lift((i + 1).toString()));
    }
  }

  public requestLift(originFloor: number, destinationFloor: number): string {
    let lift = this.lifts.sort((a, b) => {
      if (
        a.necessaryEnergy(originFloor, destinationFloor) >
        b.necessaryEnergy(originFloor, destinationFloor)
      ) {
        return 1;
      }

      if (
        a.necessaryEnergy(originFloor, destinationFloor) <
        b.necessaryEnergy(originFloor, destinationFloor)
      ) {
        return -1;
      }

      return 0;
    })[0];
    return lift.index;
  }
}

import ListController from "./components/liftController";
import Lift from "./components/lift";

// @ts-ignore
const $jq = window.$;

class Main {
  private originFloor: number = 0;
  private liftController: ListController;

  constructor() {
    this.liftController = new ListController(0, [
      new Lift("building-0"),
      new Lift("building-1"),
      new Lift("building-2")
    ]);
  }

  private onSelectFloor(e: MouseEvent) {
    const floor: number = parseInt($jq(e.target).data("floor"), 10),
      liftId: string = `#building-${Math.round(Math.random() * (3 - 1) + 1)}`,
      liftCurrentFloor = parseInt($jq(liftId).data("floor"), 10);

    console.log(liftId, liftCurrentFloor, this.originFloor);

    if (this.originFloor === floor) return;
    else if (this.originFloor === liftCurrentFloor) return this.moveLift(floor, liftId, liftCurrentFloor);
    else {
      this.moveLift(this.originFloor, liftId, liftCurrentFloor);
      return setTimeout(() => this.moveLift(floor, liftId, liftCurrentFloor), 3000);
    }
  }

  private moveLift(floor: number, liftId: string, liftCurrentFloor: number) {
    const height: number = floor * 14,
      animate: number = Math.abs(liftCurrentFloor - floor) * 750;

    $jq(liftId + " #rightDoor").removeClass("active-right");
    $jq(liftId + " #leftDoor").removeClass("active-left");

    setTimeout(function() {
      $jq(liftId + " #elevatorContainer").css("transition", "all " + animate + "ms linear");
      $jq(liftId + " #elevatorContainer").css("bottom", height + "%");
      $jq(liftId).data("floor", floor);

      setTimeout(function() {
        $jq(liftId + " #rightDoor").addClass("active-right");
        $jq(liftId + " #leftDoor").addClass("active-left");
      }, animate);
    }, 300);
  }

  private onChangeCurrentFloor(e: any) {
    this.originFloor = parseInt(e.target.value, 10);
  }

  public init() {
    $jq("#floorSelect li").click(this.onSelectFloor.bind(this));
    $jq("#currentFloor").change(this.onChangeCurrentFloor.bind(this));
  }
}

$jq(document).ready(new Main().init());

package LibTest;

import LibNet.NetLibrary;
import PetriObj.ExceptionInvalidNetStructure;
import PetriObj.ExceptionInvalidTimeDelay;
import PetriObj.PetriObjModel;
import PetriObj.PetriSim;

import java.util.ArrayList;
import java.util.Arrays;

public class TestPetriObjSimulation {

  public static void main(String[] args) throws ExceptionInvalidTimeDelay, ExceptionInvalidNetStructure {
    // runModel();
    // runModel2();
    runModel3();
  }

  // Default model
  public static void runModel() throws ExceptionInvalidTimeDelay, ExceptionInvalidNetStructure {
    PetriObjModel model = getModel();
    model.setIsProtokol(false);
    double timeModeling = 1000000;
    model.go(timeModeling);

    System.out.println("Mean value of queue");
    for (int j = 1; j < 5; j++) {
      System.out.println(model.getListObj().get(j).getNet().getListP()[0].getMean());
    }
    System.out.println("Mean value of channel worked");
    for (int j = 1; j < 4; j++) {
      System.out.println(1.0 - model.getListObj().get(j).getNet().getListP()[1].getMean());
    }
    System.out.println(2.0 - model.getListObj().get(4).getNet().getListP()[1].getMean());

    System.out.println("Estimation precision");
    double[] valuesQueue = { 1.786, 0.003, 0.004, 0.00001 };

    System.out.println(" Mean value of queue precision: ");
    for (int j = 1; j < 5; j++) {
      double inaccuracy = (model.getListObj().get(j).getNet().getListP()[0].getMean() - valuesQueue[j - 1])
          / valuesQueue[j - 1] * 100;
      inaccuracy = Math.abs(inaccuracy);
      System.out.println(inaccuracy + " %");
    }

    double[] valuesChannel = { 0.714, 0.054, 0.062, 0.036 };

    System.out.println(" Mean value of channel worked precision: ");

    for (int j = 1; j < 4; j++) {
      double inaccuracy = (1.0 - model.getListObj().get(j).getNet().getListP()[1].getMean() - valuesChannel[j - 1])
          / valuesChannel[j - 1] * 100;
      inaccuracy = Math.abs(inaccuracy);

      System.out.println(inaccuracy + " %");
    }
    double inaccuracy = (2.0 - model.getListObj().get(4).getNet().getListP()[1].getMean() - valuesChannel[3])
        / valuesChannel[3] * 100;
    inaccuracy = Math.abs(inaccuracy);

    System.out.println(inaccuracy + " %");
  }

  public static void runModel2() throws ExceptionInvalidTimeDelay, ExceptionInvalidNetStructure {
    PetriObjModel model = getModel2();
    model.setIsProtokol(false);
    model.go(10000);

    System.out.println("\nTotal processed: " + model.getListObj().get(5).getNet().getListP()[3].getMark());
  }

  public static void runModel3() throws ExceptionInvalidTimeDelay, ExceptionInvalidNetStructure {
    PetriObjModel model = getModel3();
    model.setIsProtokol(false);
    model.go(600);

    int income = model.getListObj().get(4).getNet().getListP()[4].getMark();
    int losses = model.getListObj().get(2).getNet().getListP()[2].getMark();

    System.out.println("\nIncome = " + income);
    System.out.println("Losses = " + losses);

    double meanQueueA = model.getListObj().get(2).getNet().getMeanMark("P2");
    double meanQueueB = model.getListObj().get(3).getNet().getMeanMark("P2");
    double avgQueueWaitTime = 600 * 20 * (meanQueueA + meanQueueB) / income;

    System.out.println("Avg queue wait time = " + avgQueueWaitTime);
  }

  public static PetriObjModel getModel() throws ExceptionInvalidTimeDelay, ExceptionInvalidNetStructure {
    ArrayList<PetriSim> list = new ArrayList<>();
    list.add(new PetriSim(NetLibrary.CreateNetGenerator(2.0)));
    list.add(new PetriSim(NetLibrary.CreateNetSMOwithoutQueue(1, 0.6, "First")));
    list.add(new PetriSim(NetLibrary.CreateNetSMOwithoutQueue(1, 0.3, "Second")));
    list.add(new PetriSim(NetLibrary.CreateNetSMOwithoutQueue(1, 0.4, "Third")));
    list.add(new PetriSim(NetLibrary.CreateNetSMOwithoutQueue(2, 0.1, "Forth")));
    list.add(new PetriSim(NetLibrary.CreateNetFork(0.15, 0.13, 0.3)));

    list.get(0).getNet().getListP()[1] = list.get(1).getNet().getListP()[0]; // gen -> SMO1
    list.get(1).getNet().getListP()[2] = list.get(5).getNet().getListP()[0]; // SMO1 -> fork

    list.get(5).getNet().getListP()[1] = list.get(2).getNet().getListP()[0]; // fork -> SMO2
    list.get(5).getNet().getListP()[2] = list.get(3).getNet().getListP()[0]; // fork -> SMO3
    list.get(5).getNet().getListP()[3] = list.get(4).getNet().getListP()[0]; // fork -> SMO4

    list.get(2).getNet().getListP()[2] = list.get(1).getNet().getListP()[0]; // SMO2 -> SMO1
    list.get(3).getNet().getListP()[2] = list.get(1).getNet().getListP()[0]; // SMO3 -> SMO1
    list.get(4).getNet().getListP()[2] = list.get(1).getNet().getListP()[0]; // SMO4 -> SMO1

    PetriObjModel model = new PetriObjModel(list);
    return model;
  }

  public static PetriObjModel getModel2() throws ExceptionInvalidTimeDelay, ExceptionInvalidNetStructure {
    ArrayList<PetriSim> list = new ArrayList<>();

    list.add(new PetriSim(NetLibrary.CreateNetGenerator(40.0)));

    list.add(new PetriSim(NetLibrary.CreateNetRobot(6, "Robot A to M1")));
    list.add(new PetriSim(NetLibrary.CreateNetSMOwithoutQueue(3, 60, "M1")));
    list.get(2).getNet().getListT()[0].setDistributionParam("norm");
    list.get(2).getNet().getListT()[0].setParamDeviation(10);

    list.add(new PetriSim(NetLibrary.CreateNetRobot(7, "Robot M1 to M2")));
    list.add(new PetriSim(NetLibrary.CreateNetSMOwithoutQueue(3, 100, "M2")));

    list.add(new PetriSim(NetLibrary.CreateNetRobot(5, "Robot M2 to Store")));

    list.get(0).getNet().getListP()[1] = list.get(1).getNet().getListP()[0]; // gen -> Robot1
    list.get(1).getNet().getListP()[3] = list.get(2).getNet().getListP()[0]; // Robot1 -> Machine1
    list.get(2).getNet().getListP()[2] = list.get(3).getNet().getListP()[0]; // Machine1 -> Robot2
    list.get(3).getNet().getListP()[3] = list.get(4).getNet().getListP()[0]; // Robot2 -> Machine2
    list.get(4).getNet().getListP()[2] = list.get(5).getNet().getListP()[0]; // Machine2 -> Robot3

    PetriObjModel model = new PetriObjModel(list);
    return model;
  }

  public static PetriObjModel getModel3() throws ExceptionInvalidTimeDelay, ExceptionInvalidNetStructure {
    ArrayList<PetriSim> list = new ArrayList<>();

    PetriSim genStationA = new PetriSim(NetLibrary.CreateNetGenerator(0.5));
    genStationA.getNet().getListT()[0].setDistributionParam("unif");
    genStationA.getNet().getListT()[0].setParamDeviation(0.2);
    PetriSim genStationB = new PetriSim(NetLibrary.CreateNetGenerator(0.5));
    genStationB.getNet().getListT()[0].setDistributionParam("unif");
    genStationB.getNet().getListT()[0].setParamDeviation(0.2);

    PetriSim queueStationA = new PetriSim(NetLibrary.CreateNetBusQueue("Station A bus queue"));
    PetriSim queueStationB = new PetriSim(NetLibrary.CreateNetBusQueue("Station B bus queue"));

    PetriSim travelBus1ToB = new PetriSim(NetLibrary.CreateNetBusTravel(20, 2, 1, "Bus 1 travel from A to B"));
    PetriSim travelBus2ToB = new PetriSim(NetLibrary.CreateNetBusTravel(30, 1, 1, "Bus 2 travel from A to B"));

    PetriSim travelBus1ToA = new PetriSim(NetLibrary.CreateNetBusTravel(20, 2, 0, "Bus 1 travel from B to A"));
    PetriSim travelBus2ToA = new PetriSim(NetLibrary.CreateNetBusTravel(30, 1, 0, "Bus 2 travel from B to A"));

    genStationA.getNet().getListP()[1] = queueStationA.getNet().getListP()[0];
    genStationB.getNet().getListP()[1] = queueStationB.getNet().getListP()[0];

    travelBus1ToB.getNet().getListP()[0] = queueStationA.getNet().getListP()[1];
    travelBus2ToB.getNet().getListP()[0] = queueStationA.getNet().getListP()[1];

    travelBus1ToA.getNet().getListP()[0] = queueStationB.getNet().getListP()[1];
    travelBus2ToA.getNet().getListP()[0] = queueStationB.getNet().getListP()[1];

    // shared bus 1/2 at station A place
    travelBus1ToA.getNet().getListP()[5] = travelBus1ToB.getNet().getListP()[1];
    travelBus2ToA.getNet().getListP()[5] = travelBus2ToB.getNet().getListP()[1];
    // shared bus 1/2 at station B place
    travelBus1ToB.getNet().getListP()[5] = travelBus1ToA.getNet().getListP()[1];
    travelBus2ToB.getNet().getListP()[5] = travelBus2ToA.getNet().getListP()[1];

    // shared income place
    travelBus2ToB.getNet().getListP()[4] = travelBus1ToB.getNet().getListP()[4];
    travelBus1ToA.getNet().getListP()[4] = travelBus1ToB.getNet().getListP()[4];
    travelBus2ToA.getNet().getListP()[4] = travelBus1ToB.getNet().getListP()[4];

    // shared losses place
    queueStationB.getNet().getListP()[2] = queueStationA.getNet().getListP()[2];

    list.addAll(Arrays.asList(
        genStationA, genStationB, queueStationA, queueStationB, travelBus1ToB, travelBus2ToB, travelBus1ToA,
        travelBus2ToA));

    PetriObjModel model = new PetriObjModel(list);
    return model;
  }
}

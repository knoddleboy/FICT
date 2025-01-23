package LibNet;

import PetriObj.ArcIn;
import PetriObj.ArcOut;
import PetriObj.ExceptionInvalidNetStructure;
import PetriObj.ExceptionInvalidTimeDelay;
import PetriObj.PetriNet;
import PetriObj.PetriP;
import PetriObj.PetriT;
import java.util.ArrayList;
import java.util.Random;

public class NetLibrary {

  public static PetriNet CreateNetRobot(int delayMove, String name)
      throws ExceptionInvalidNetStructure, ExceptionInvalidTimeDelay {
    ArrayList<PetriP> d_P = new ArrayList<>();
    ArrayList<PetriT> d_T = new ArrayList<>();
    ArrayList<ArcIn> d_In = new ArrayList<>();
    ArrayList<ArcOut> d_Out = new ArrayList<>();

    d_P.add(new PetriP("P1", 0));
    d_P.add(new PetriP("P2", 0));
    d_P.add(new PetriP("P3", 0));
    d_P.add(new PetriP("P4", 0));
    d_P.add(new PetriP("P5", 0));
    d_P.add(new PetriP("P6", 1));

    d_T.add(new PetriT("T1", 8));
    d_T.get(0).setDistribution("unif", d_T.get(0).getTimeServ());
    d_T.get(0).setParamDeviation(1.0);
    d_T.add(new PetriT("T2", delayMove));
    d_T.add(new PetriT("T3", 8));
    d_T.get(2).setDistribution("unif", d_T.get(2).getTimeServ());
    d_T.get(2).setParamDeviation(1.0);
    d_T.add(new PetriT("T4", delayMove));

    d_In.add(new ArcIn(d_P.get(0), d_T.get(0), 1)); // P1 -> T1
    d_In.add(new ArcIn(d_P.get(1), d_T.get(1), 1)); // P2 -> T2
    d_In.add(new ArcIn(d_P.get(2), d_T.get(2), 1)); // P3 -> T3
    d_In.add(new ArcIn(d_P.get(4), d_T.get(3), 1)); // P5 -> T4
    d_In.add(new ArcIn(d_P.get(5), d_T.get(0), 1)); // P6 -> T1

    d_Out.add(new ArcOut(d_T.get(0), d_P.get(1), 1)); // T1 -> P2
    d_Out.add(new ArcOut(d_T.get(1), d_P.get(2), 1)); // T2 -> P3
    d_Out.add(new ArcOut(d_T.get(2), d_P.get(3), 1)); // T3 -> P4
    d_Out.add(new ArcOut(d_T.get(2), d_P.get(4), 1)); // T3 -> P5
    d_Out.add(new ArcOut(d_T.get(3), d_P.get(5), 1)); // T4 -> P6

    PetriNet d_Net = new PetriNet(name, d_P, d_T, d_In, d_Out);
    PetriP.initNext();
    PetriT.initNext();
    ArcIn.initNext();
    ArcOut.initNext();

    return d_Net;
  }

  public static PetriNet CreateNetBusQueue(String name)
      throws ExceptionInvalidNetStructure, ExceptionInvalidTimeDelay {
    ArrayList<PetriP> d_P = new ArrayList<>();
    ArrayList<PetriT> d_T = new ArrayList<>();
    ArrayList<ArcIn> d_In = new ArrayList<>();
    ArrayList<ArcOut> d_Out = new ArrayList<>();

    d_P.add(new PetriP("P1", 0));
    d_P.add(new PetriP("P2", 0)); // queue
    d_P.add(new PetriP("P3", 0)); // losses

    d_T.add(new PetriT("T1", 0));
    d_T.add(new PetriT("T2", 0, 2));

    d_In.add(new ArcIn(d_P.get(0), d_T.get(0), 1)); // P1 -> T1
    d_In.add(new ArcIn(d_P.get(0), d_T.get(1), 1)); // P1 -> T2
    d_In.add(new ArcIn(d_P.get(1), d_T.get(1), 30, true)); // P2 -> T2

    d_Out.add(new ArcOut(d_T.get(0), d_P.get(1), 1)); // T1 -> P2
    d_Out.add(new ArcOut(d_T.get(1), d_P.get(2), 20)); // T2 -> P3

    PetriNet d_Net = new PetriNet(name, d_P, d_T, d_In, d_Out);
    PetriP.initNext();
    PetriT.initNext();
    ArcIn.initNext();
    ArcOut.initNext();

    return d_Net;
  }

  public static PetriNet CreateNetBusTravel(double travelDelay, int busPrior, int busAtStation, String name)
      throws ExceptionInvalidNetStructure, ExceptionInvalidTimeDelay {
    ArrayList<PetriP> d_P = new ArrayList<>();
    ArrayList<PetriT> d_T = new ArrayList<>();
    ArrayList<ArcIn> d_In = new ArrayList<>();
    ArrayList<ArcOut> d_Out = new ArrayList<>();

    d_P.add(new PetriP("P1", 0)); // queue
    d_P.add(new PetriP("P2", busAtStation)); // bus at station
    d_P.add(new PetriP("P3", 0));
    d_P.add(new PetriP("P4", 0));
    d_P.add(new PetriP("P5", 0)); // income
    d_P.add(new PetriP("P6", 0)); // but at other station

    d_T.add(new PetriT("T1", 0, busPrior)); // boarding
    d_T.add(new PetriT("T2", travelDelay)); // travel
    d_T.get(1).setDistribution("unif", d_T.get(1).getTimeServ());
    d_T.get(1).setParamDeviation(5.0);
    d_T.add(new PetriT("T3", 5));
    d_T.get(2).setDistribution("unif", d_T.get(2).getTimeServ());
    d_T.get(2).setParamDeviation(1.0);

    int n = 25;

    d_In.add(new ArcIn(d_P.get(0), d_T.get(0), n)); // P1 -> T1
    d_In.add(new ArcIn(d_P.get(1), d_T.get(0), 1)); // P2 -> T1
    d_In.add(new ArcIn(d_P.get(2), d_T.get(1), 1)); // P3 -> T2
    d_In.add(new ArcIn(d_P.get(3), d_T.get(2), 1)); // P4 -> T3

    d_Out.add(new ArcOut(d_T.get(0), d_P.get(2), 1)); // T1 -> P3
    d_Out.add(new ArcOut(d_T.get(1), d_P.get(3), 1)); // T2 -> P4
    d_Out.add(new ArcOut(d_T.get(2), d_P.get(4), n * 20)); // T3 -> P5
    d_Out.add(new ArcOut(d_T.get(2), d_P.get(5), 1)); // T3 -> P6

    PetriNet d_Net = new PetriNet(name, d_P, d_T, d_In, d_Out);
    PetriP.initNext();
    PetriT.initNext();
    ArcIn.initNext();
    ArcOut.initNext();

    return d_Net;
  }

  /**
   * Creates Petri net that describes the dynamics of system of the mass
   * service (with unlimited queue)
   *
   * @param numChannel the quantity of devices
   * @param timeMean   the mean value of service time of unit
   * @param name       the individual name of SMO
   * @throws ExceptionInvalidTimeDelay if one of net's transitions has no input
   *                                   position.
   * @return Petri net dynamics of which corresponds to system of mass service
   *         with given parameters
   * @throws PetriObj.ExceptionInvalidNetStructure
   */
  public static PetriNet CreateNetSMOwithoutQueue(int numChannel, double timeMean, String name)
      throws ExceptionInvalidNetStructure, ExceptionInvalidTimeDelay {
    ArrayList<PetriP> d_P = new ArrayList<>();
    ArrayList<PetriT> d_T = new ArrayList<>();
    ArrayList<ArcIn> d_In = new ArrayList<>();
    ArrayList<ArcOut> d_Out = new ArrayList<>();
    d_P.add(new PetriP("P1", 0));
    d_P.add(new PetriP("P2", numChannel));
    d_P.add(new PetriP("P3", 0));
    d_T.add(new PetriT("T1", timeMean));
    d_T.get(0).setDistribution("exp", d_T.get(0).getTimeServ());
    d_T.get(0).setParamDeviation(0.0);
    d_In.add(new ArcIn(d_P.get(0), d_T.get(0), 1));
    d_In.add(new ArcIn(d_P.get(1), d_T.get(0), 1));
    d_Out.add(new ArcOut(d_T.get(0), d_P.get(1), 1));
    d_Out.add(new ArcOut(d_T.get(0), d_P.get(2), 1));
    PetriNet d_Net = new PetriNet("SMOwithoutQueue" + name, d_P, d_T, d_In, d_Out);
    PetriP.initNext();
    PetriT.initNext();
    ArcIn.initNext();
    ArcOut.initNext();

    return d_Net;
  }

  /**
   * Creates Petri net that describes the dynamics of arrivals of demands for
   * service
   *
   * @param timeMean mean value of interval between arrivals
   * @return Petri net dynamics of which corresponds to generator
   * @throws PetriObj.ExceptionInvalidTimeDelay    if Petri net has invalid
   *                                               structure
   * @throws PetriObj.ExceptionInvalidNetStructure
   */
  public static PetriNet CreateNetGenerator(double timeMean)
      throws ExceptionInvalidNetStructure, ExceptionInvalidTimeDelay {
    ArrayList<PetriP> d_P = new ArrayList<>();
    ArrayList<PetriT> d_T = new ArrayList<>();
    ArrayList<ArcIn> d_In = new ArrayList<>();
    ArrayList<ArcOut> d_Out = new ArrayList<>();
    d_P.add(new PetriP("P1", 1));
    d_P.add(new PetriP("P2", 0));
    d_T.add(new PetriT("T1", timeMean, Double.MAX_VALUE));
    d_T.get(0).setDistribution("exp", d_T.get(0).getTimeServ());
    d_T.get(0).setParamDeviation(0.0);
    d_In.add(new ArcIn(d_P.get(0), d_T.get(0), 1));
    d_Out.add(new ArcOut(d_T.get(0), d_P.get(1), 1));
    d_Out.add(new ArcOut(d_T.get(0), d_P.get(0), 1));
    PetriNet d_Net = new PetriNet("Generator", d_P, d_T, d_In, d_Out);
    PetriP.initNext();
    PetriT.initNext();
    ArcIn.initNext();
    ArcOut.initNext();

    return d_Net;
  }

  /**
   * Creates Petri net that describes the route choice with given
   * probabilities
   *
   * @param p1 the probability of choosing the first route
   * @param p2 the probability of choosing the second route
   * @param p3 the probability of choosing the third route
   * @return Petri net dynamics of which corresponds to fork of routs
   * @throws PetriObj.ExceptionInvalidTimeDelay    if Petri net has invalid
   *                                               structure
   * @throws PetriObj.ExceptionInvalidNetStructure
   */
  public static PetriNet CreateNetFork(double p1, double p2, double p3)
      throws ExceptionInvalidNetStructure, ExceptionInvalidTimeDelay {
    ArrayList<PetriP> d_P = new ArrayList<>();
    ArrayList<PetriT> d_T = new ArrayList<>();
    ArrayList<ArcIn> d_In = new ArrayList<>();
    ArrayList<ArcOut> d_Out = new ArrayList<>();
    d_P.add(new PetriP("P1", 0));
    d_P.add(new PetriP("P2", 0));
    d_P.add(new PetriP("P3", 0));
    d_P.add(new PetriP("P4", 0));
    d_P.add(new PetriP("P5", 0));
    d_T.add(new PetriT("T1", 0.0, Double.MAX_VALUE));
    d_T.get(0).setProbability(p1);
    d_T.add(new PetriT("T2", 0.0, Double.MAX_VALUE));
    d_T.get(1).setProbability(p2);
    d_T.add(new PetriT("T3", 0.0, Double.MAX_VALUE));
    d_T.get(2).setProbability(p3);
    d_T.add(new PetriT("T4", 0.0, Double.MAX_VALUE));
    d_T.get(3).setProbability(1 - p1 - p2 - p3);
    d_In.add(new ArcIn(d_P.get(0), d_T.get(0), 1));
    d_In.add(new ArcIn(d_P.get(0), d_T.get(1), 1));
    d_In.add(new ArcIn(d_P.get(0), d_T.get(2), 1));
    d_In.add(new ArcIn(d_P.get(0), d_T.get(3), 1));
    d_Out.add(new ArcOut(d_T.get(0), d_P.get(1), 1));
    d_Out.add(new ArcOut(d_T.get(1), d_P.get(2), 1));
    d_Out.add(new ArcOut(d_T.get(2), d_P.get(3), 1));
    d_Out.add(new ArcOut(d_T.get(3), d_P.get(4), 1));
    PetriNet d_Net = new PetriNet("Fork", d_P, d_T, d_In, d_Out);
    PetriP.initNext();
    PetriT.initNext();
    ArcIn.initNext();
    ArcOut.initNext();

    return d_Net;
  }
}
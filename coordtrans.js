/* <script src="https://wdms.epa.gov.tw/idms/_js/coordtrans.js"></script> */
var A1_84 = 6378137.0;
var B1_84 = 6356752.3141;
var e2_84 = 0.0066943800355;
var A1_67 = 6378160.0;
var B1_67 = 6356774.7192;
var e2_67 = 0.006694541853;
var SK = new Array(0.9999, 1.0, 0.9996);
var Cent = new Array(121.0, 121.0, 123.0);
var Shift = new Array(250000.0, 350000.0, 500000.0);
var DegreePI = 180.0 / Math.PI;

var XM84 = -3033819.548;
var YM84 = 5071301.969;
var ZM84 = 2391982.060;
var DeltaX84 = 754.812;
var DeltaY84 = 362.233;
var DeltaZ84 = 187.197;
var EpsilonX84 = -5.216 / 3600.0 / DegreePI;
var EpsilonY84 = -8.846 / 3600.0 / DegreePI;
var EpsilonZ84 = 35.781 / 3600.0 / DegreePI;
var S84 = 3.161E-6;

function LatLon2UTM(Lat, Lon, AreaCode, Flag) {
	var E1, E2, PH2, LM2, PH1, LM1, Temp1, Temp2, Temp3, Temp4;
	var Temp5, Temp6, Temp7;
	var RAP, UU, N, T;
	var A, B, C, D, E, PM, PH;
	var A1, B1;

	if (Flag == 0) {
		A1 = A1_84;
		B1 = B1_84;
	}
	else {
		A1 = A1_67;
		B1 = B1_67;
	}

	E1 = 1.0 - (B1 / A1) * (B1 / A1);
	E2 = (A1 / B1) * (A1 / B1) - 1.0;

	PH2 = Lat / DegreePI;
	LM2 = Lon / DegreePI;
	LM1 = Cent[AreaCode] / DegreePI;
	PH1 = 0.0;

	Temp1 = Math.sin(PH2);
	Temp2 = Math.cos(PH2);
	RAP = LM2 - LM1;
	UU = E2 * Temp2 * Temp2;
	Temp3 = 1.0 - E1 * Temp1 * Temp1;
	N = A1 / Math.sqrt(Temp3);
	T = Temp1 / Temp2;
	Temp4 = N * Temp2 * RAP;
	Temp5 = N * (1.0 - T * T + UU) * Math.pow(Temp2, 3.0) * Math.pow(RAP, 3.0) / 6.0;
	Temp6 = 5.0 - 18.0 * Math.pow(T, 2.0) + Math.pow(T, 4.0) + 14.0 * UU -
			58.0 * UU * T * T;
	Temp7 = N * Temp6 * Math.pow(Temp2, 5.0) * Math.pow(RAP, 5.0) / 120.0;

	LM2 = Temp4 + Temp5 + Temp7;
	LM2 = SK[AreaCode] * LM2 + Shift[AreaCode];

	Temp4 = Math.pow(E1, 2.0);
	Temp5 = Math.pow(E1, 3.0);
	Temp6 = Math.pow(E1, 4.0);
	A = 1.0 + 0.75 * E1 + 45.0 * Temp4 / 64.0 + 175.0 * Temp5 / 256.0 +
		11025.0 * Temp6 / 16384.0;
	B = 0.75 * E1 + 15.0 * Temp4 / 16.0 + 525.0 * Temp5 / 512.0 +
		2205.0 * Temp6 / 2048.0;
	C = 15.0 * Temp4 / 64.0 + 105.0 * Temp5 / 256.0 + 2205.0 * Temp6 / 4096.0;
	D = 35.0 * Temp5 / 512.0 + 315.0 * Temp6 / 2048.0;
	E = 315.0 * Temp6 / 16384.0;

	Temp4 = A * (PH2 - PH1) - B * (Math.sin(2.0 * PH2) - Math.sin(2.0 * PH1)) / 2.0;
	Temp5 = C * (Math.sin(4.0 * PH2) - Math.sin(4.0 * PH1));
	Temp6 = D * (Math.sin(6.0 * PH2) - Math.sin(6.0 * PH1));
	Temp7 = E * (Math.sin(8.0 * PH2) - Math.sin(8.0 * PH1));

	PM = A1 * (1.0 - E1) * (Temp4 + (Temp5 / 4.0) + (Temp6 / 6.0) + (Temp7 / 8.0));

	Temp4 = N * T * Math.pow(RAP, 2.0) * Math.pow(Temp2, 2.0) / 2.0;
	Temp5 = 5.0 - Math.pow(T, 2.0) + 9.0 * UU + 4.0 * Math.pow(UU, 2.0);
	Temp6 = Math.pow(Temp2, 4.0) * Math.pow(RAP, 4.0) / 24.0;
	Temp7 = 61.0 - 58.0 * T * T + Math.pow(T, 4.0) + 270.0 * UU - 330.0 * UU * T * T;

	PH = PM + Temp4 + N * T * Temp5 * Temp6 +
		 N * T * Math.pow(PH2, 6.0) * Math.pow(RAP, 6.0) * Temp7 / 720.0;

	PH2 = SK[AreaCode] * PH;

	var pt = new Array(1);
	pt[0] = LM2;
	pt[1] = PH2;
	return pt;
}

function UTM2LatLon(X, Y, AreaCode, Flag) {
	var N, E1, CN, CE, PH2, PH1, DS, RM, DPH;
	var Temp1, Temp2, Temp3, T, R, UU;
	var LM2, S, A1, B1;
	var i, IPAT;

	if (Flag == 0) {
		A1 = A1_84;
		B1 = B1_84;
	}
	else {
		A1 = A1_67;
		B1 = B1_67;
	}

	E1 = 1.0 - (B1 / A1) * (B1 / A1);
	CN = Y;
	CE = X;
	CN /= SK[AreaCode];
	CE = (CE - Shift[AreaCode]) / SK[AreaCode];
	PH2 = 0.0;
	IPAT = 1200;
	DS = CN / IPAT;

	for (i = 1; i <= IPAT; i++) {
		Temp1 = Math.pow(Math.sin(PH2), 2.0);
		Temp2 = 1.0 - E1 * Temp1;
		Temp3 = Math.pow(Temp2, 1.5);
		RM = A1 * (1.0 - E1) / Temp3;
		DPH = DS / (2.0 * RM);
		PH1 = PH2 + DPH;
		Temp1 = Math.pow(Math.sin(PH1), 2.0);
		Temp2 = 1.0 - E1 * Temp1;
		Temp3 = Math.pow(Temp2, 1.5);
		RM = A1 * (1.0 - E1) / Temp3;
		DPH = DS / RM;
		PH2 = PH2 + DPH;
	}

	T = Math.sin(PH2) / Math.cos(PH2);
	Temp1 = Math.pow(Math.sin(PH2), 2.0);
	Temp2 = 1.0 - E1 * Temp1;
	Temp3 = Math.pow(Temp2, 1.5);
	R = A1 * (1.0 - E1) / Temp3;
	Temp3 = Math.pow(Temp2, 0.5);
	N = A1 / Temp3;
	UU = N / R;
	S = 1.0 / Math.cos(PH2);
	Temp1 = T * Math.pow(CE, 2.0) / (2.0 * R * N);
	Temp2 = T * Math.pow(CE, 4.0) * ((-4.0 * Math.pow(UU, 2.0)) +
			(9.0 * (1.0 - T * T)) + (12.0 * T * T)) /
			(24.0 * R * Math.pow(N, 3.0));
	Temp3 = T * Math.pow(CE, 6.0) * ((8.0 * Math.pow(UU, 4.0) * (11.0 - 24.0 * T * T)) -
			(12.0 * Math.pow(UU, 3.0) * (21.0 - 71.0 * T * T)) +
			(15.0 * Math.pow(UU, 2.0) * (15.0 - (98.0 * T * T) + (15.0 * Math.pow(T, 4)))) +
			(180.0 * UU * (5.0 * T * T - 3.0 * Math.pow(T, 4.0))) +
			(360.0 * Math.pow(T, 4.0))) / (720. * R * Math.pow(N, 5.0));
	PH2 = PH2 - Temp1 + Temp2 - Temp3;

	var Lat = PH2 * DegreePI;

	Temp1 = S * CE / N;
	Temp2 = S * Math.pow(CE, 3.0) * (UU + 2.0 * T * T) / (6 * Math.pow(N, 3.0));
	Temp3 = S * Math.pow(CE, 5.0) * ((-4.0 * Math.pow(UU, 3.0) * (1.0 - 6.0 * T * T)) +
			(UU * UU * (9.0 - 68.0 * T * T)) + (72.0 * UU * T * T) +
			(24.0 * Math.pow(T, 4.0))) / (120.0 * Math.pow(N, 5.0));
	LM2 = Temp1 - Temp2 + Temp3;
	var Lon = 121 + LM2 * DegreePI;

	var pt = new Array(1);

	pt[0] = Lat;
	pt[1] = Lon;
	return pt;
}
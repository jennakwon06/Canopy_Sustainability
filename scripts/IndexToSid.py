import os, os.path
import csv

sids = {
 (2, 'AA'),  
 (24, 'AAPL'),  
 (62, 'ABT'),  
 (64, 'ABX'),  
 (67, 'ADSK'),  
 (76, 'TAP'),  
 (88, 'ACI'),  
 (107, 'ACV'),  
 (114, 'ADBE'),  
 (122, 'ADI'),  
 (128, 'ADM'),  
 (154, 'AEM'),  
 (161, 'AEP'),  
 (166, 'AES'),  
 (168, 'AET'),  
 (185, 'AFL'),  
 (197, 'AGCO'),  
 (205, 'AGN'),  
 (216, 'HES'),  
 (239, 'AIG'),  
 (273, 'ALU'),  
 (328, 'ALTR'),  
 (337, 'AMAT'),  
 (338, 'BEAM'),  
 (351, 'AMD'),  
 (357, 'TWX'),  
 (368, 'AMGN'),  
 (374, 'AMLN'),  
 (389, 'AMR'),  
 (438, 'AON'),  
 (448, 'APA'),  
 (455, 'APC'),  
 (460, 'APD'),  
 (465, 'APH'),  
 (510, 'ARG'),  
 (559, 'ASH'),  
 (607, 'ATML'),  
 (629, 'AU'),  
 (630, 'ADP'),  
 (660, 'AVP'),  
 (679, 'AXP'),  
 (693, 'AZO'),  
 (698, 'BA'),  
 (700, 'BAC'),  
 (734, 'BAX'),  
 (739, 'BBBY'),  
 (754, 'BBY'),  
 (779, 'BCR'),  
 (780, 'BCS'),  
 (789, 'BDK'),  
 (794, 'BDX'),  
 (801, 'BEC'),  
 (812, 'BEN'),  
 (858, 'BHI'),  
 (863, 'BHP'),  
 (902, 'BJS'),  
 (903, 'BK'),  
 (915, 'BKE'),  
 (963, 'BMC'),  
 (980, 'BMY'),  
 (995, 'BNI'),  
 (1010, 'BNS'),  
 (1057, 'BPL'),  
 (1062, 'BPOP'),  
 (1091, 'BRK'),  
 (1131, 'BSX'),  
 (1209, 'CA'),  
 (1228, 'CAG'),  
 (1267, 'CAT'),  
 (1274, 'CB'),  
 (1283, 'CBE'),  
 (1287, 'CBI'),  
 (1332, 'CCE'),  
 (1335, 'C'),  
 (1374, 'CDE'),  
 (1376, 'CAH'),  
 (1406, 'CELG'),  
 (1416, 'CEPH'),  
 (1419, 'CERN'),  
 (1539, 'CI'),  
 (1582, 'CL'),  
 (1595, 'CLF'),  
 (1616, 'CLX'),  
 (1620, 'CMA'),  
 (1637, 'CMCS'),  
 (1638, 'CMCS'),  
 (1665, 'CMS'),  
 (1696, 'CNW'),  
 (1746, 'COG'),  
 (1763, 'COMS'),  
 (1787, 'COST'),  
 (1792, 'CP'),  
 (1795, 'CPB'),  
 (1882, 'CRUS'),  
 (1898, 'CSC'),  
 (1900, 'CSCO'),  
 (1937, 'CSX'),  
 (1960, 'CTL'),  
 (1985, 'CMI'),  
 (2000, 'CVC'),  
 (2035, 'CX'),  
 (2043, 'CY'),  
 (2069, 'FTR'),  
 (2071, 'D'),  
 (2100, 'DBD'),  
 (2119, 'DD'),  
 (2127, 'DE'),  
 (2170, 'DHR'),  
 (2174, 'DIA'),  
 (2190, 'DIS'),  
 (2262, 'DOV'),  
 (2263, 'DOW'),  
 (2293, 'DRE'),  
 (2298, 'DHI'),  
 (2330, 'DTE'),  
 (2351, 'DUK'),  
 (2368, 'DVN'),  
 (2371, 'DV'),  
 (2427, 'ECL'),  
 (2434, 'ED'),  
 (2500, 'ELN'),  
 (2518, 'EMC'),  
 (2530, 'EMR'),  
 (2546, 'KMP'),  
 (2564, 'EOG'),  
 (2568, 'EP'),  
 (2587, 'EQT'),  
 (2602, 'EA'),  
 (2618, 'ESRX'),  
 (2621, 'ESV'),  
 (2633, 'ETN'),  
 (2637, 'ETR'),  
 (2663, 'EXPD'),  
 (2673, 'F'),  
 (2696, 'FAST'),  
 (2754, 'M'),  
 (2760, 'FDO'),  
 (2765, 'FDX'),  
 (2853, 'FISV'),  
 (2855, 'FITB'),  
 (2935, 'FST'),  
 (2938, 'S'),  
 (2968, 'NEE'),  
 (3014, 'FRX'),  
 (3076, 'FWLT'),  
 (3128, 'GCI'),  
 (3136, 'GD'),  
 (3149, 'GE'),  
 (3166, 'GENZ'),  
 (3189, 'AXLL'),  
 (3212, 'GILD'),  
 (3214, 'GIS'),  
 (3241, 'GLW'),  
 (3242, 'GSK'),  
 (3321, 'GPS'),  
 (3327, 'GR'),  
 (3328, 'GRA'),  
 (3384, 'GT'),  
 (3421, 'GWW'),  
 (3443, 'HAL'),  
 (3450, 'MNST'),  
 (3460, 'HAS'),  
 (3472, 'HBAN'),  
 (3476, 'HBHC'),  
 (3488, 'HCN'),  
 (3490, 'HCP'),  
 (3496, 'HD'),  
 (3499, 'HOG'),  
 (3585, 'HL'),  
 (3596, 'HMA'),  
 (3607, 'HMSY'),  
 (3617, 'HNZ'),  
 (3620, 'HFC'),  
 (3629, 'HOLX'),  
 (3642, 'HOT'),  
 (3647, 'HP'),  
 (3660, 'HRB'),  
 (3668, 'HRL'),  
 (3695, 'HSY'),  
 (3718, 'HUM'),  
 (3735, 'HPQ'),  
 (3766, 'IBM'),  
 (3806, 'BIIB'),  
 (3840, 'IGT'),  
 (3951, 'INTC'),  
 (3971, 'IP'),  
 (3990, 'IPG'),  
 (4010, 'IR'),  
 (4080, 'ITW'),  
 (4108, 'JBHT'),  
 (4117, 'JCI'),  
 (4118, 'JCP'),  
 (4120, 'JEC'),  
 (4141, 'JKHY'),  
 (4151, 'JNJ'),  
 (4192, 'K'),  
 (4199, 'KBH'),  
 (4221, 'KEY'),  
 (4238, 'KIM'),  
 (4246, 'KLAC'),  
 (4263, 'KMB'),  
 (4283, 'KO'),  
 (4297, 'KR'),  
 (4313, 'KSS'),  
 (4315, 'KSU'),  
 (4417, 'LEN'),  
 (4485, 'LLTC'),  
 (4487, 'LLY'),  
 (4488, 'LM'),  
 (4498, 'LNC'),  
 (4521, 'LOW'),  
 (4531, 'LPX'),  
 (4537, 'LRCX'),  
 (4553, 'LSI'),  
 (4564, 'LTD'),  
 (4569, 'L'),  
 (4579, 'LUFK'),  
 (4589, 'LUV'),  
 (4620, 'LZ'),  
 (4664, 'SM'),  
 (4665, 'MAS'),  
 (4668, 'MAT'),  
 (4684, 'MBI'),  
 (4707, 'MCD'),  
 (4736, 'MDC'),  
 (4758, 'MDT'),  
 (4799, 'CVS'),  
 (4809, 'MFC'),  
 (4823, 'MGA'),  
 (4831, 'MGM'),  
 (4849, 'MHFI'),  
 (4876, 'MIL'),  
 (4914, 'MMC'),  
 (4922, 'MMM'),  
 (4954, 'MO'),  
 (4963, 'MHK'),  
 (4974, 'MSI'),  
 (5025, 'MI'),  
 (5029, 'MRK'),  
 (5035, 'MRO'),  
 (5061, 'MSFT'),  
 (5092, 'MTG'),  
 (5117, 'MTB'),  
 (5121, 'MU'),  
 (5126, 'MUR'),  
 (5149, 'MXIM'),  
 (5166, 'MYL'),  
 (5199, 'NAV'),  
 (5213, 'NBL'),  
 (5214, 'NBR'),  
 (5249, 'NE'),  
 (5253, 'NDSN'),  
 (5261, 'NEM'),  
 (5310, 'NI'),  
 (5328, 'NKE'),  
 (5343, 'THC'),  
 (5382, 'JWN'),  
 (5387, 'NOC'),  
 (5442, 'NSC'),  
 (5452, 'NSM'),  
 (5479, 'NTRS'),  
 (5484, 'NU'),  
 (5488, 'NUE'),  
 (5509, 'NVLS'),  
 (5520, 'NWL'),  
 (5530, 'FOX'),  
 (5626, 'OI'),  
 (5634, 'OKE'),  
 (5651, 'OMC'),  
 (5692, 'ORCL'),  
 (5719, 'OSK'),  
 (5729, 'OXY'),  
 (5767, 'PAYX'),  
 (5769, 'PBCT'),  
 (5773, 'PBI'),  
 (5787, 'PCAR'),  
 (5792, 'PCG'),  
 (5813, 'PCL'),  
 (5822, 'PCP'),  
 (5862, 'PEG'),  
 (5885, 'PEP'),  
 (5923, 'PFE'),  
 (5938, 'PG'),  
 (5950, 'PGR'),  
 (5956, 'PH'),  
 (5969, 'PHM'),  
 (6030, 'PLL'),  
 (6068, 'PNC'),  
 (6077, 'PNM'),  
 (6082, 'PNR'),  
 (6109, 'POT'),  
 (6116, 'PPG'),  
 (6119, 'PPL'),  
 (6151, 'PDE'),  
 (6161, 'PRGO'),  
 (6174, 'PL'),  
 (6257, 'PVH'),  
 (6272, 'PX'),  
 (6295, 'QCOM'),  
 (6330, 'RAD'),  
 (6392, 'RDC'),  
 (6413, 'REGN'),  
 (6455, 'RGLD'),  
 (6482, 'RJF'),  
 (6536, 'ROK'),  
 (6543, 'ROP'),  
 (6546, 'ROST'),  
 (6583, 'RTN'),  
 (6584, 'RIO'),  
 (6612, 'RYL'),  
 (6653, 'T'),  
 (6683, 'SBUX'),  
 (6704, 'SCHW'),  
 (6769, 'SEE'),  
 (6803, 'SFD'),  
 (6868, 'SHW'),  
 (6870, 'SI'),  
 (6884, 'SII'),  
 (6928, 'SLB'),  
 (6930, 'HSH'),  
 (6935, 'SLM'),  
 (6984, 'SNE'),  
 (6992, 'PII'),  
 (7007, 'SNV'),  
 (7011, 'SO'),  
 (7041, 'TRV'),  
 (7061, 'SPLS'),  
 (7086, 'SPW'),  
 (7107, 'NVE'),  
 (7139, 'STT'),  
 (7143, 'SAN'),  
 (7145, 'STEC'),  
 (7152, 'STI'),  
 (7156, 'STJ'),  
 (7171, 'STR'),  
 (7178, 'SYK'),  
 (7211, 'SUN'),  
 (7216, 'JAVA'),  
 (7233, 'SVU'),  
 (7242, 'SWK'),  
 (7244, 'SWN'),  
 (7254, 'SWY'),  
 (7265, 'SY'),  
 (7272, 'SYMC'),  
 (7285, 'SYY'),  
 (7369, 'TE'),  
 (7386, 'TEF'),  
 (7401, 'TER'),  
 (7407, 'TEVA'),  
 (7408, 'TEX'),  
 (7447, 'TIF'),  
 (7457, 'TJX'),  
 (7468, 'TLAB'),  
 (7493, 'TMO'),  
 (7530, 'TOL'),  
 (7538, 'TOT'),  
 (7543, 'TM'),  
 (7561, 'TRA'),  
 (7580, 'TRMB'),  
 (7590, 'TROW'),  
 (7612, 'TSO'),  
 (7671, 'TXN'),  
 (7674, 'TXT'),  
 (7679, 'TYC'),  
 (7684, 'TSN'),  
 (7696, 'UBS'),  
 (7715, 'UDR'),  
 (7784, 'UN'),  
 (7792, 'UNH'),  
 (7797, 'UNM'),  
 (7800, 'UNP'),  
 (7883, 'UTX'),  
 (7904, 'VAR'),  
 (7949, 'VFC'),  
 (7962, 'CBS'),  
 (7990, 'VLO'),  
 (7998, 'VMC'),  
 (8014, 'VNO'),  
 (8017, 'VOD'),  
 (8045, 'VRTX'),  
 (8089, 'WAG'),  
 (8132, 'WDC'),  
 (8151, 'WFC'),  
 (8158, 'WFM'),  
 (8178, 'WHR'),  
 (8214, 'WMB'),  
 (8229, 'WMT'),  
 (8284, 'WSM'),  
 (8326, 'WY'),  
 (8329, 'X'),  
 (8340, 'XL'),  
 (8344, 'XLNX'),  
 (8347, 'XOM'),  
 (8354, 'XRX'),  
 (8383, 'FL'),  
 (8399, 'ZION'),  
 (8459, 'CREE'),  
 (8461, 'CHK'),  
 (8468, 'DDR'),  
 (8554, 'SPY'),  
 (8572, 'ACT'),  
 (8580, 'ACE'),  
 (8655, 'INTU'),  
 (8677, 'MCHP'),  
 (8816, 'FOSL'),  
 (8817, 'GGP'),  
 (8831, 'JBL'),  
 (8857, 'ORLY'),  
 (8863, 'RCL'),  
 (9038, 'RIG'),  
 (9074, 'XTO'),  
 (9096, 'BDN'),  
 (9156, 'FLIR'),  
 (9189, 'KGC'),  
 (9435, 'PETM'),  
 (9514, 'BWA'),  
 (9540, 'EQR'),  
 (9693, 'BKS'),  
 (9699, 'CAL'),  
 (9736, 'GMCR'),  
 (9883, 'ATVI'),  
 (9909, 'DECK'),  
 (9936, 'GFI'),  
 (9947, 'HST'),  
 (10025, 'PRE'),  
 (10231, 'NFX'),  
 (10254, 'PTEN'),  
 (10303, 'URBN'),  
 (10409, 'HGSI'),  
 (10528, 'SPG'),  
 (10533, 'SU'),  
 (10545, 'TQNT'),  
 (10594, 'EMN'),  
 (10649, 'HAIN'),  
 (10796, 'MLM'),  
 (10869, 'TSCO'),  
 (10897, 'AKS'),  
 (10898, 'ALB'),  
 (10908, 'VRX'),  
 (10953, 'FLEX'),  
 (10984, 'MAC'),  
 (11042, 'RKT'),  
 (11086, 'AEO'),  
 (11100, 'BRK'),  
 (11120, 'EXP'),  
 (11130, 'GDI'),  
 (11189, 'RAH'),  
 (11224, 'VVUS'),  
 (11301, 'GGB'),  
 (11673, 'NOK'),  
 (11752, 'CLI'),  
 (11873, 'ACS'),  
 (11901, 'SIRI'),  
 (12087, 'O'),  
 (12107, 'SSYS'),  
 (12160, 'COF'),  
 (12213, 'FOXA'),  
 (12267, 'VECO'),  
 (12350, 'MCK'),  
 (12362, 'SWC'),  
 (12378, 'STM'),  
 (12626, 'ASML'),  
 (12652, 'DLTR'),  
 (12662, 'FMER'),  
 (12691, 'LMT'),  
 (12856, 'AGU'),  
 (12882, 'DRI'),  
 (12909, 'LH'),  
 (12915, 'MDY'),  
 (12959, 'DDD'),  
 (13017, 'DISH'),  
 (13083, 'PAAS'),  
 (13176, 'CAM'),  
 (13197, 'FCX'),  
 (13306, 'SUNE'),  
 (13635, 'DO'),  
 (13711, 'PCYC'),  
 (13771, 'WLT'),  
 (13841, 'EL'),  
 (13891, 'LXK'),  
 (13905, 'NTAP'),  
 (13940, 'SNDK'),  
 (13962, 'WAT'),  
 (14014, 'CTXS'),  
 (14064, 'HIG'),  
 (14081, 'ITT'),  
 (14141, 'SPN'),  
 (14284, 'SCCO'),  
 (14328, 'ALXN'),  
 (14372, 'EIX'),  
 (14388, 'IRM'),  
 (14479, 'CCJ'),  
 (14484, 'CENX'),  
 (14516, 'EWA'),  
 (14517, 'EWC'),  
 (14518, 'EWG'),  
 (14519, 'EWH'),  
 (14520, 'EWJ'),  
 (14530, 'EWW'),  
 (14700, 'CRR'),  
 (14774, 'OLED'),  
 (14848, 'YHOO'),  
 (14986, 'ONXX'),  
 (15101, 'CHKP'),  
 (15206, 'QGEN'),  
 (15230, 'TIE'),  
 (15397, 'STRA'),  
 (15474, 'ETFC'),  
 (15516, 'LAMR'),  
 (15581, 'SRCL'),  
 (15596, 'TD'),  
 (15622, 'ANF'),  
 (15697, 'OCN'),  
 (15789, 'DNR'),  
 (16059, 'NUS'),  
 (16108, 'STLD'),  
 (16136, 'OVIP'),  
 (16178, 'CNI'),  
 (16348, 'DGX'),  
 (16453, 'CIEN'),  
 (16511, 'KMX'),  
 (16586, 'AMTD'),  
 (16589, 'IVZ'),  
 (16661, 'ROVI'),  
 (16838, 'ALV'),  
 (16841, 'AMZN'),  
 (16850, 'BBT'),  
 (16853, 'BEXP'),  
 (17009, 'BXP'),  
 (17080, 'MS'),  
 (17104, 'Q'),  
 (17188, 'CTV'),  
 (17207, 'FLS'),  
 (17395, 'MT'),  
 (17436, 'PXD'),  
 (17448, 'SLG'),  
 (17618, 'AYE'),  
 (17632, 'CHRW'),  
 (17702, 'NLY'),  
 (17735, 'PWER'),  
 (17767, 'TLM'),  
 (17773, 'TSM'),  
 (17787, 'YUM'),  
 (17800, 'AMG'),  
 (17850, 'FE'),  
 (17925, 'SID'),  
 (18113, 'URI'),  
 (18221, 'VRSN'),  
 (18522, 'ARMH'),  
 (18529, 'BRCM'),  
 (18561, 'FTO'),  
 (18584, 'LNT'),  
 (18711, 'FMX'),  
 (18738, 'LLL'),  
 (18821, 'VTR'),  
 (18822, 'WCN'),  
 (18834, 'AVB'),  
 (18870, 'CTSH'),  
 (18929, 'KG'),  
 (19079, 'EPD'),  
 (19135, 'PLD'),  
 (19147, 'RSG'),  
 (19149, 'RX'),  
 (19181, 'WM'),  
 (19249, 'RRC'),  
 (19250, 'SAP'),  
 (19258, 'CCI'),  
 (19336, 'WFT'),  
 (19614, 'PFCB'),  
 (19654, 'XLB'),  
 (19655, 'XLE'),  
 (19656, 'XLF'),  
 (19657, 'XLI'),  
 (19658, 'XLK'),  
 (19659, 'XLP'),  
 (19660, 'XLU'),  
 (19661, 'XLV'),  
 (19662, 'XLY'),  
 (19675, 'BP'),  
 (19725, 'NVDA'),  
 (19778, 'DLM'),  
 (19787, 'EWBC'),  
 (19800, 'LIFE'),  
 (19831, 'BBRY'),  
 (19894, 'INFY'),  
 (19916, 'PBG'),  
 (19917, 'PCLN'),  
 (19920, 'QQQ'),  
 (19926, 'NUAN'),  
 (19954, 'AZN'),  
 (19990, 'INFA'),  
 (20061, 'BRCD'),  
 (20066, 'CEG'),  
 (20088, 'GS'),  
 (20133, 'PNRA'),  
 (20208, 'FFIV'),  
 (20239, 'JNPR'),  
 (20276, 'RDN'),  
 (20277, 'RAI'),  
 (20281, 'SBAC'),  
 (20284, 'SKX'),  
 (20330, 'BMRN'),  
 (20373, 'HSBC'),  
 (20374, 'HCBK'),  
 (20387, 'JDSU'),  
 (20394, 'MDRX'),  
 (20438, 'TIBX'),  
 (20541, 'RHT'),  
 (20680, 'AKAM'),  
 (20689, 'BLK'),  
 (20773, 'PKG'),  
 (20866, 'FNSR'),  
 (20910, 'PTV'),  
 (20914, 'QCOR'),  
 (20940, 'UPS'),  
 (21090, 'TGT'),  
 (21271, 'IBN'),  
 (21326, 'SLAB'),  
 (21382, 'EW'),  
 (21418, 'MET'),  
 (21429, 'ONNN'),  
 (21439, 'PTR'),  
 (21448, 'SINA'),  
 (21491, 'EWY'),  
 (21507, 'IJH'),  
 (21508, 'IJR'),  
 (21513, 'IVV'),  
 (21514, 'IVW'),  
 (21516, 'IWB'),  
 (21517, 'IWD'),  
 (21518, 'IWF'),  
 (21519, 'IWM'),  
 (21522, 'IYF'),  
 (21536, 'NVS'),  
 (21550, 'RSH'),  
 (21555, 'SMH'),  
 (21608, 'CYH'),  
 (21612, 'DNDN'),  
 (21619, 'EWT'),  
 (21651, 'IYM'),  
 (21652, 'IYR'),  
 (21660, 'MBT'),  
 (21666, 'MRVL'),  
 (21669, 'NTES'),  
 (21682, 'VALE'),  
 (21683, 'RKH'),  
 (21724, 'ARNA'),  
 (21735, 'CNQ'),  
 (21750, 'ENDP'),  
 (21757, 'EWZ'),  
 (21758, 'EZU'),  
 (21774, 'ILMN'),  
 (21785, 'IWN'),  
 (21786, 'IWO'),  
 (21813, 'SOHU'),  
 (21839, 'VZ'),  
 (21916, 'PBR'),  
 (21935, 'SJM'),  
 (21964, 'XEL'),  
 (21971, 'ABV'),  
 (22096, 'LNG'),  
 (22099, 'COH'),  
 (22110, 'DVA'),  
 (22114, 'EXC'),  
 (22139, 'MCO'),  
 (22140, 'MON'),  
 (22148, 'OEF'),  
 (22169, 'SNP'),  
 (22226, 'GG'),  
 (22247, 'NXY'),  
 (22250, 'NYCB'),  
 (22316, 'GRMN'),  
 (22324, 'MEE'),  
 (22332, 'PGN'),  
 (22406, 'UPL'),  
 (22416, 'AMX'),  
 (22443, 'GPN'),  
 (22445, 'IBB'),  
 (22446, 'ICF'),  
 (22463, 'OIH'),  
 (22464, 'OIS'),  
 (22467, 'PBR'),  
 (22574, 'ABB'),  
 (22660, 'BTU'),  
 (22721, 'RTH'),  
 (22739, 'VTI'),  
 (22747, 'ADS'),  
 (22766, 'CVI'),  
 (22784, 'FTI'),  
 (22802, 'MDLZ'),  
 (22844, 'STO'),  
 (22876, 'FIS'),  
 (22880, 'COL'),  
 (22908, 'IWR'),  
 (22909, 'IWS'),  
 (22954, 'ABC'),  
 (22959, 'BG'),  
 (22972, 'EFA'),  
 (22996, 'JOY'),  
 (23021, 'ECA'),  
 (23047, 'ZMH'),  
 (23055, 'CIG'),  
 (23058, 'CS'),  
 (23103, 'WLP'),  
 (23112, 'CVX'),  
 (23113, 'DB'),  
 (23118, 'EPP'),  
 (23133, 'IGE'),  
 (23134, 'ILF'),  
 (23151, 'PFG'),  
 (23175, 'AAP'),  
 (23269, 'WTW'),  
 (23283, 'CNC'),  
 (23328, 'PRU'),  
 (23438, 'GME'),  
 (23444, 'ITUB'),  
 (23477, 'ACL'),  
 (23536, 'VALE'),  
 (23650, 'ARO'),  
 (23709, 'NFLX'),  
 (23780, 'HEW'),  
 (23821, 'SWKS'),  
 (23870, 'IEF'),  
 (23881, 'LQD'),  
 (23906, 'GOLD'),  
 (23911, 'SHY'),  
 (23912, 'SNY'),  
 (23921, 'TLT'),  
 (23998, 'COP'),  
 (24064, 'CNP'),  
 (24070, 'DKS'),  
 (24074, 'ERIC'),  
 (24105, 'PALM'),  
 (24112, 'PXP'),  
 (24124, 'WYNN'),  
 (24125, 'XEC'),  
 (24475, 'CME'),  
 (24482, 'EQIX'),  
 (24491, 'IAG'),  
 (24518, 'STX'),  
 (24522, 'TS'),  
 (24547, 'EGO'),  
 (24622, 'NIHD'),  
 (24692, 'CCL'),  
 (24705, 'EEM'),  
 (24757, 'A'),  
 (24758, 'CNX'),  
 (24760, 'AMT'),  
 (24778, 'SRE'),  
 (24783, 'AEE'),  
 (24785, 'PLD'),  
 (24791, 'OUTR'),  
 (24809, 'NOV'),  
 (24811, 'GES'),  
 (24819, 'EBAY'),  
 (24829, 'APOL'),  
 (24831, 'ESI'),  
 (24832, 'RL'),  
 (24833, 'FLR'),  
 (24838, 'ALL'),  
 (24840, 'ATI'),  
 (24873, 'STZ'),  
 (24923, 'MWW'),  
 (24962, 'PSA'),  
 (25006, 'JPM'),  
 (25010, 'USB'),  
 (25066, 'CHL'),  
 (25090, 'HON'),  
 (25093, 'JEF'),  
 (25165, 'BBL'),  
 (25298, 'BTI'),  
 (25317, 'DELL'),  
 (25339, 'ISRG'),  
 (25392, 'AMED'),  
 (25445, 'MHS'),  
 (25485, 'AGG'),  
 (25555, 'ACN'),  
 (25593, 'IYT'),  
 (25647, 'DVY'),  
 (25660, 'TRQ'),  
 (25707, 'WLL'),  
 (25714, 'AUY'),  
 (25729, 'CTRP'),  
 (25781, 'NG'),  
 (25801, 'TIP'),  
 (25802, 'TPX'),  
 (25920, 'MAR'),  
 (25948, 'TRW'),  
 (25960, 'DIG'),  
 (25967, 'ATHR'),  
 (26073, 'ETP'),  
 (26111, 'DTV'),  
 (26126, 'BBD'),  
 (26143, 'NRG'),  
 (26150, 'HOS'),  
 (26169, 'SHLD'),  
 (26243, 'HSP'),  
 (26323, 'GNW'),  
 (26367, 'CBG'),  
 (26401, 'CRM'),  
 (26434, 'MFE'),  
 (26462, 'NETL'),  
 (26487, 'HK'),  
 (26491, 'VMED'),  
 (26506, 'BUCY'),  
 (26578, 'GOOG'),  
 (26617, 'IOC'),  
 (26658, 'TTM'),  
 (26669, 'VNQ'),  
 (26703, 'FXI'),  
 (26721, 'MOS'),  
 (26758, 'DLR'),  
 (26761, 'MTL'),  
 (26807, 'GLD'),  
 (26882, 'LVS'),  
 (26892, 'HLF'),  
 (26960, 'CE'),  
 (26981, 'IAU'),  
 (26994, 'DRYS'),  
 (27019, 'WIN'),  
 (27030, 'HUN'),  
 (27035, 'ANR'),  
 (27100, 'VGK'),  
 (27102, 'VWO'),  
 (27206, 'PAY'),  
 (27357, 'LBTY'),  
 (27406, 'THS'),  
 (27411, 'LEAP'),  
 (27437, 'SLW'),  
 (27451, 'FMCN'),  
 (27470, 'RDS'),  
 (27474, 'DMND'),  
 (27487, 'RDS'),  
 (27533, 'BIDU'),  
 (27543, 'EXPE'),  
 (27558, 'CF'),  
 (27572, 'ROC'),  
 (27608, 'LBTY'),  
 (27653, 'LCC'),  
 (27676, 'AMP'),  
 (27712, 'FNF'),  
 (27802, 'KBE'),  
 (27806, 'SDY'),  
 (27809, 'ICE'),  
 (27817, 'SPWR'),  
 (27822, 'UA'),  
 (27824, 'ICO'),  
 (27872, 'VIAB'),  
 (27894, 'FXE'),  
 (27905, 'STP'),  
 (27993, 'LINE'),  
 (27997, 'WNR'),  
 (28016, 'CMG'),  
 (28051, 'UAL'),  
 (28054, 'DBC'),  
 (28057, 'HS'),  
 (28074, 'XHB'),  
 (28083, 'XCO'),  
 (28116, 'GPOR'),  
 (28130, 'ME'),  
 (28145, 'NYX'),  
 (28160, 'MDVN'),  
 (28252, 'HIMX'),  
 (28320, 'USO'),  
 (28364, 'VIG'),  
 (28368, 'SLV'),  
 (31886, 'TCK'),  
 (32011, 'ITB'),  
 (32046, 'LINT'),  
 (32133, 'GDX'),  
 (32146, 'MA'),  
 (32268, 'SH'),  
 (32269, 'DDM'),  
 (32270, 'SSO'),  
 (32272, 'QLD'),  
 (32274, 'XME'),  
 (32275, 'XRT'),  
 (32278, 'KRE'),  
 (32279, 'XOP'),  
 (32283, 'KOG'),  
 (32301, 'CTRX'),  
 (32320, 'JCG'),  
 (32381, 'QID'),  
 (32382, 'SDS'),  
 (32384, 'DXD'),  
 (32393, 'WYN'),  
 (32497, 'HBI'),  
 (32603, 'WU'),  
 (32608, 'OC'),  
 (32618, 'RVBD'),  
 (32619, 'WCRX'),  
 (32620, 'PFF'),  
 (32650, 'EVEP'),  
 (32724, 'APKT'),  
 (32856, 'CSIQ'),  
 (32887, 'HTZ'),  
 (32902, 'FSLR'),  
 (33030, 'SE'),  
 (33033, 'IPGP'),  
 (33067, 'TSL'),  
 (33070, 'MPEL'),  
 (33127, 'DBA'),  
 (33133, 'TWC'),  
 (33148, 'CSJ'),  
 (33154, 'SHV'),  
 (33206, 'RWM'),  
 (33208, 'UWM'),  
 (33211, 'TWM'),  
 (33263, 'UYM'),  
 (33265, 'UYG'),  
 (33266, 'URE'),  
 (33272, 'DUG'),  
 (33274, 'SRS'),  
 (33277, 'SKF'),  
 (33303, 'JASO'),  
 (33316, 'MLNX'),  
 (33334, 'FXY'),  
 (33370, 'UUP'),  
 (33486, 'VEU'),  
 (33588, 'ARUN'),  
 (33651, 'BSV'),  
 (33652, 'BND'),  
 (33655, 'HYG'),  
 (33697, 'UNG'),  
 (33698, 'TMUS'),  
 (33729, 'DAL'),  
 (33748, 'RSX'),  
 (33752, 'VRUS'),  
 (33856, 'CLR'),  
 (33955, 'LDK'),  
 (33985, 'YGE'),  
 (34010, 'COV'),  
 (34011, 'DFS'),  
 (34014, 'TEL'),  
 (34067, 'BX'),  
 (34164, 'DXJ'),  
 (34385, 'VEA'),  
 (34395, 'LULU'),  
 (34440, 'CXO'),  
 (34525, 'MELI'),  
 (34545, 'VMW'),  
 (34631, 'MOO'),  
 (34661, 'TDC'),  
 (34873, 'PCX'),  
 (34913, 'RF'),  
 (34953, 'ULTA'),  
 (34993, 'EEV'),  
 (35006, 'SD'),  
 (35034, 'FXP'),  
 (35114, 'SFSF'),  
 (35174, 'SOA'),  
 (35175, 'JNK'),  
 (35323, 'EMB'),  
 (35531, 'CPN'),  
 (35793, 'EPI'),  
 (35902, 'PM'),  
 (35920, 'V'),  
 (35970, 'ACWI'),  
 (36118, 'DPS'),  
 (36144, 'TBT'),  
 (36176, 'CFX'),  
 (36243, 'AGNC'),  
 (36346, 'LO'),  
 (36403, 'DTO'),  
 (36714, 'RAX'),  
 (36763, 'WPRT'),  
 (36930, 'DISC'),  
 (37044, 'ERY'),  
 (37048, 'FAZ'),  
 (37049, 'FAS'),  
 (37083, 'SPXS'),  
 (37133, 'TZA'),  
 (37513, 'ERX'),  
 (37514, 'SPXL'),  
 (37515, 'TNA'),  
 (37732, 'EUO'),  
 (37736, 'UCO'),  
 (37737, 'SCO'),  
 (37762, 'ZSL'),  
 (37764, 'AGQ'),  
 (37852, 'EDC'),  
 (37854, 'TECL'),  
 (37855, 'EDZ'),  
 (38054, 'VXX'),  
 (38084, 'MJN'),  
 (38263, 'AMJ'),  
 (38418, 'OPEN'),  
 (38532, 'SPXU'),  
 (38533, 'UPRO'),  
 (38554, 'BUD'),  
 (38596, 'DRN'),  
 (38650, 'AVGO'),  
 (38688, 'TBF'),  
 (38691, 'CFN'),  
 (38725, 'SGOL'),  
 (38769, 'AONE'),  
 (38815, 'BSBR'),  
 (38887, 'TWO'),  
 (38921, 'LEA'),  
 (38926, 'GDXJ'),  
 (38936, 'DG'),  
 (38965, 'FTNT'),  
 (38971, 'CLD'),  
 (38989, 'AOL'),  
 (39037, 'BAC'),  
 (39053, 'CIT'),  
 (39073, 'CIE'),  
 (39095, 'CHTR'),  
 (39099, 'C'),  
 (39211, 'SQQQ'),  
 (39214, 'TQQQ'),  
 (39421, 'F'),  
 (39431, 'MERU'),  
 (39432, 'SSNC'),  
 (39495, 'SDRL'),  
 (39546, 'LYB'),  
 (39778, 'QEP'),  
 (39797, 'OAS'),  
 (39840, 'TSLA'),  
 (39960, 'MCP'),  
 (39994, 'NXPI'),  
 (40053, 'AMLP'),  
 (40107, 'VOO'),  
 (40160, 'CCSC'),  
 (40181, 'ELT'),  
 (40353, 'SODA'),  
 (40430, 'GM'),  
 (40515, 'TVIX'),  
 (40516, 'XIV'),  
 (40553, 'NUGT'),  
 (40554, 'DUST'),  
 (40555, 'DANG'),  
 (40562, 'YOKU'),  
 (40597, 'FLT'),  
 (40616, 'MMI'),  
 (40669, 'VIXY'),  
 (40755, 'NLSN'),  
 (40852, 'KMI'),  
 (41013, 'BKLN'),  
 (41047, 'HCA'),  
 (41149, 'QIHU'),  
 (41150, 'APO'),  
 (41182, 'GNC'),  
 (41382, 'SPLV'),  
 (41451, 'LNKD'),  
 (41462, 'MOS'),  
 (41484, 'YNDX'),  
 (41554, 'FIO'),  
 (41579, 'P'),  
 (41636, 'MPC'),  
 (41730, 'Z'),  
 (41968, 'SVXY'),  
 (41969, 'UVXY'),  
 (42118, 'GRPN'),  
 (42173, 'DLPH'),  
 (42230, 'TRIP'),  
 (42270, 'KORS'),  
 (42277, 'ZNGA'),  
 (42304, 'OIH'),  
 (42306, 'SMH'),  
 (42586, 'BOND'),  
 (42596, 'YELP'),  
 (42788, 'PSX'),  
 (42815, 'SPLK'),  
 (42950, 'FB'),  
 (43127, 'NOW'),  
 (43202, 'PANW'),  
 (43399, 'ADT'),  
 (43405, 'KRFT'),  
 (43500, 'RLGY'),  
 (43510, 'WDAY'),  
 (43694, 'ABBV'),  
 (43721, 'SCTY'),  
 (43919, 'LMCA'),  
 (44060, 'ZTS'),  
 (44375, 'PF'),  
 (44508, 'CST'),  
 (44909, 'COTY'),  
 (44931, 'NWSA'),  
 (44963, 'COLE'),  
 (44986, 'LXFT'),  
 (44990, 'HDS'),  
 (45006, 'TRMR'),  
 (45007, 'CDW'),  
 (45014, 'NDLS'),  
 (45015, 'RNA'),  
 (45504, 'COVS'),  
 (45505, 'MONT'),  
 (45506, 'PINC'),  
 (45520, 'VMEM'),  
 (45521, 'RNG'),  
 (45526, 'PEGI')}

csvfile = '../public/data/master.csv'
csvfile_new = '../public/data/master_temp.csv'

with open(csvfile, 'r+') as csvinput:
    with open(csvfile_new, 'w') as csvoutput:
        reader = csv.reader(csvinput)
        writer = csv.writer(csvoutput, lineterminator='\n')

        all = []
        row = reader.next()
        row.append('sid')
        all.append(row)

        for row in reader:
            ticker = row[0].split()[0]
            print row[0].split()[0]
            sid = list(i for i, v in enumerate(sids) if v[1] == ticker)
            if (len(sid) >= 1):
                row.append(sid[0])
            all.append(row)

        writer.writerows(all)

os.remove(csvfile) # not needed on unix
os.rename(csvfile_new, csvfile)
var todayTotDate = null;
var todayChkYear = null;
var todayChkMonth = null;
var todayChkDate = null;
var todayChkDay = null;
var todayChkHours = null;
var todayMinutes = null;

$(window).ready(function(){
	//금일 날짜 체크
	fn_today_setChk();
	
	//오늘날짜 setting
	fn_todaySetting();
	
	//통합 스케줄 setting
	fn_totScdSetting();
	
	//서버정보 리스트 setting
	fn_serverListSetting();
	
	//개별 서버 리스트 setting
	fn_dbSvrIdSearch();
});


/* ********************************************************
 * 통합 스케줄 셋팅
 ******************************************************** */
function fn_totScdSetting() {
	var tot_start = "";
	var tot_end = "";
	var tot_run = "";
	var scheduleCnt = "";

	if (nvlPrmSet("${backupInfo}", '') != "") {
		scheduleCnt = nvlPrmSet("${backupInfo.schedule_cnt}", '0');
		
		if (scheduleCnt != 0) {
			//시작
			if (nvlPrmSet("${scheduleInfo.start_cnt}", '') != "") {
				tot_start = nvlPrmSet("${scheduleInfo.start_cnt}", '0') / scheduleCnt * 100;
				tot_start = tot_start.toFixed(2);
			} else {
				tot_start = "0.00";
			}
			
			if (nvlPrmSet("${scheduleInfo.stop_cnt}", '') != "") {
				tot_end = nvlPrmSet("${scheduleInfo.stop_cnt}", '0') / scheduleCnt * 100;
				tot_end = tot_end.toFixed(2);
			} else {
				tot_end = "0.00";
			}
			
			if (nvlPrmSet("${scheduleInfo.run_cnt}", '') != "") {
				tot_run = nvlPrmSet("${scheduleInfo.run_cnt}", '0') / scheduleCnt * 100;
				tot_run = tot_run.toFixed(2);
			} else {
				tot_run = "0.00";
			}
		} else {
			tot_start = "0.00";
			tot_end = "0.00";
			tot_run = "0.00";
		}
	} else {
		tot_start = "0.00";
		tot_end = "0.00";
		tot_run = "0.00";
	}

	$("#tot_scd_start_msg").append(tot_start);	//시작
	$("#tot_scd_stop_msg").append(tot_end);		//중지
	$("#tot_scd_run_msg").append(tot_run);		//실행중
	
}

/* ********************************************************
 * 메인 대시보드 셋팅
 ******************************************************** */
function fn_main_tab_setting(result) {
	
	//백업일정, 배치일정, 데이터이행 일정 setting
	fn_schedule_cnt_set(result);

	//스케줄 이력 목록 setting
	fn_schedule_History_set(result);

	//백업 이력 목록 setting
	fn_backup_History_set(result);
	
	//배치 이력 목록 setting
	fn_script_History_set(result);

	if (nvlPrmSet($("#db2pg_yn", "#dashboardViewForm").val(), "N") == "Y") {
		//데이터 이행 setting
		fn_migration_history_set(result);
	}
}

/* ********************************************************
 * 서버리스트 설정
 ******************************************************** */
function fn_dbSvrIdSearch() {
	$.ajax({
		url : "/dashboarod_main_search.do",
		data : {
			db_svr_id : "1"
		},
		dataType : "json",
		type : "post",
		beforeSend: function(xhr) {
	    	xhr.setRequestHeader("AJAX", true);
	    },
	    error : function(xhr, status, error) {
			if(xhr.status == 401) {
				showSwalIconRst(message_msg02, closeBtn, '', 'error', 'top');
			} else if(xhr.status == 403) {
				showSwalIconRst(message_msg03, closeBtn, '', 'error', 'top');
			} else {
				showSwalIcon("ERROR CODE : "+ xhr.status+ "\n\n"+ "ERROR Message : "+ error+ "\n\n"+ "Error Detail : "+ xhr.responseText.replace(/(<([^>]+)>)/gi, ""), closeBtn, '', 'error');
			}
		},
		success : function(result) {
			//update setting
			fn_main_tab_setting(result);
		}
	});
}

/* ********************************************************
 * 화면시작 오늘날짜 셋팅
 ******************************************************** */
function fn_todaySetting() {
	today = new Date();
	var today_date = new Date();

	var today_ing = today.toJSON().slice(0,10).replace(/-/g,'-');
	var dayOfMonth = today.getDate();
	today_date.setDate(dayOfMonth - 7);

	var html = "<i class='fa fa-calendar menu-icon'></i> "+today_ing;
	var sdtHisTimehtml = "<i class='fa fa-calendar menu-icon'></i> "+today_date.toJSON().slice(0,10).replace(/-/g,'-') + " ~ " + today_ing;
	
	$( "#tot_sdt_today" ).append(html);						//통합스케줄
	$( "#tot_scd_ing_msg" ).append(html);					//금일예정

	$( "#tot_sdt_his_today" ).append(sdtHisTimehtml);		//스케줄 이력
	$( "#tot_back_his_today" ).append(sdtHisTimehtml);		//백업 이력
	$( "#tot_script_his_today" ).append(sdtHisTimehtml);	//배치 이력
	$( "#tot_migration_his_today" ).append(sdtHisTimehtml);	//migration 이력
}

/* ********************************************************
 * 금일 날짜 설정
 ******************************************************** */
function fn_today_setChk() {
	todayTotDate = new Date();
	todayChkYear = todayTotDate.getFullYear(); // 년도
	todayChkMonth = String(todayTotDate.getMonth() + 1);  // 월
	todayChkDate = String(todayTotDate.getDate());  // 날짜
	todayChkDay = todayTotDate.getDay();  // 요일
	todayChkHours = String(todayTotDate.getHours()); // 시
	todaySetHours = todayTotDate.getHours(); 		// 변경전
	todayChkMinutes = String(todayTotDate.getMinutes());  // 분

	if(todayChkMonth.length < 2){ 
		todayChkMonth = "0" + todayChkMonth; 
	}

	if(todayChkDate.length == 1){ 
		todayChkDate = "0" + todayChkDate;
	}
	
	if(todayChkHours.length < 2){ 
		todayChkHours = "0" + todayChkHours; 
	}

	if(todayChkMinutes.length == 1){ 
		todayChkMinutes = "0" + todayChkMinutes;
	}
}

/* ********************************************************
 * 일정 설정
 ******************************************************** */
function fn_schedule_cnt_set(result) {
	var checkDt = todayChkMonth + "" + todayChkDate;
	var checkYear = todayChkYear + "" + todayChkMonth + "" + todayChkDate; //전체 날짜
	var checkDay = todayChkDate;

	var backHtml = "";
	var scriptHtml = "";
	var backCount=0;
	var scriptCount=0;
	var exe_perd_cd_val = "";
	var scdHK = "";
	var checkMons = "";
	var ampm ="";
	var hours = "";

	/////////////////////백업일정 start////////////////////////////////////////////////
	if (result.backupScdCnt != null && result.backupScdCnt > 0) {
		backHtml += "<tr>";

		$(result.backupScdresult).each(function (index, item) {
			exe_perd_cd_val = item.exe_perd_cd;
			scdHK = "";
			var resultYearCheckDt = item.exe_month + "" + item.exe_day;
				
			if(exe_perd_cd_val == 'TC001605') {			//1회실행
				if(item.exe_dt == checkYear) {
					scdHK = 'TC001605';
				}
			} else if(exe_perd_cd_val == 'TC001601') {		//매일
				if(item.frst_reg_dtm <= checkYear) {
					scdHK = 'TC001601';
				}
			} else if(exe_perd_cd_val == 'TC001602') {		//매주
				if(item.frst_reg_dtm <= checkYear) {
					for(var i=0;i<7;i++){
						if(item.exe_dt.substr(i,1) == '1') {
							checkMons = i;
						}

						if (checkMons == todayChkDay) {
							scdHK = 'TC001602';
							continue;
						}
					}
				}
			} else if(exe_perd_cd_val == 'TC001603') {			//매월
				if(item.frst_reg_dtm <= checkYear) {
					if(item.exe_day == checkDay) {
						scdHK = 'TC001603';
					}
				}
			} else if(exe_perd_cd_val == 'TC001604') {
				if(item.frst_reg_dtm <= checkYear) {
					if(resultYearCheckDt == checkDt) {
						scdHK = 'TC001604';
					}
				}
			}

			if (scdHK != null && scdHK != "") {
				backHtml += '<td style="width:25%;line-height:150%;border:none;">';

				if (item.bck_bsn_dscd == 'TC000201') {
					if (item.bck_opt_cd == 'TC000301') { //전체백업
						backHtml += "	<i class='fa fa-paste mr-2 text-success'></i>";
					} else if(item.bck_opt_cd == 'TC000302'){ //증분백업
						backHtml += "	<i class='fa fa-comments-o text-warning'></i>";
					} else { //변경이력백업
						backHtml += "	<i class='fa fa-exchange mr-2 text-info' ></i>";
					}
				} else if (item.bck_bsn_dscd == 'TC000202') {
					backHtml += "	<i class='fa fa-file-code-o mr-2 text-danger' ></i>";
				}

				backHtml += "<a class='nav-link_title' href='#' onclick='fn_scheduleListMove(\""+item.scd_nm+"\");'>";	
				backHtml += "&nbsp;"+ item.scd_nm;
				backHtml += "</a>";
				backHtml += '<br/>';

				if (item.scd_cndt == 'TC001801') { //대기
					backHtml += "	<i class='fa fa-circle mr-2 text-success' ></i>";
				} else { //실행중
					backHtml += '<div class="badge badge-pill badge-warning"><spring:message code="dashboard.running" /></div>';
				}

				if(scdHK == 'TC001605') { 				//1회실행
					backHtml += schedule_one_time_run;
				} else if(scdHK == 'TC001601') { 		//매일
					backHtml += schedule_everyday;
				} else if (scdHK == 'TC001602') {		//매주
					backHtml += schedule_everyweek;
				} else if (scdHK == 'TC001603') {		//매월
					backHtml += schedule_everymonth;
				} else if(scdHK == 'TC001604') {	//매년
					backHtml += schedule_everyyear;
				}
				backHtml += '<br/>';

				ampm = item.exe_hh >= 12 ? 'pm' : 'am';
				hours = item.exe_hh % 12;
				hours = hours.length < 2 ? '0'+hours : hours;
				minutes = item.exe_mm.length < 2 ? '0'+item.exe_mm : item.exe_mm;

				backHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + hours + ":" + minutes + " " + ampm;

				backCount = backCount + 1;

				backHtml += '</td>';
			}

			//4의 배수일때 tr 추가
			if (backCount % 4 == 0)  {
				backHtml += "</tr>";
				backHtml += "<tr>";
			}
		});
		backHtml += "</tr>";
	} else {
		backHtml += "<tr>";
		backHtml += '<td class="text-center" style="width:100%;border:none;height:20px;background-color:#c9ccd7;">';
		backHtml += dashboard_msg02
		backHtml += '</td>';
		backHtml += "</tr>";
	}

	$("#bakupScheduleCntList").html(backHtml);
	/////////////////////백업일정 end////////////////////////////////////////////////

	/////////////////////배치일정 start////////////////////////////////////////////////
	if (result.backupScdCnt != null && result.backupScdCnt > 0) {
		scriptHtml += "<tr>";

		$(result.scriptScdresult).each(function (index, item) {
			exe_perd_cd_val = item.exe_perd_cd;
			scdHK = "";
			var resultYearCheckDt = item.exe_month + "" + item.exe_day;

			if(exe_perd_cd_val == 'TC001605') {			//1회실행
				if(item.exe_dt == checkYear) {
					scdHK = 'TC001605';
				}
			} else if(exe_perd_cd_val == 'TC001601') {		//매일
				if(item.frst_reg_dtm <= checkYear) {
					scdHK = 'TC001601';
				}
			} else if(exe_perd_cd_val == 'TC001602') {		//매주
				if(item.frst_reg_dtm <= checkYear) {
					for(var i=0;i<7;i++){
						if(item.exe_dt.substr(i,1) == '1') {
							checkMons = i;
						}

						if (checkMons == todayChkDay) {
							scdHK = 'TC001602';
							continue;
						}
					}
				}
			} else if(exe_perd_cd_val == 'TC001603') {			//매월
				if(item.frst_reg_dtm <= checkYear) {
					if(item.exe_day == checkDay) {
						scdHK = 'TC001603';
					}
				}
			} else if(exe_perd_cd_val == 'TC001604') {
				if(item.frst_reg_dtm <= checkYear) {
					if(resultYearCheckDt == checkDt) {
						scdHK = 'TC001604';
					}
				}
			}

			if (scdHK != null && scdHK != "") {
				scriptHtml += '<td style="width:33%;line-height:150%">';
				scriptHtml += "	<i class='fa fa-exchange mr-2 text-primary' ></i>";

				scriptHtml += "<a class='nav-link_title' href='#' onclick='fn_scheduleListMove(\""+item.scd_nm+"\");'>";	
				scriptHtml += "&nbsp;"+ item.scd_nm;
				scriptHtml += "</a>";
				scriptHtml += '<br/>';

				if (item.scd_cndt == 'TC001801') { //대기
					scriptHtml += "	<i class='fa fa-circle mr-2 text-success' ></i>";
				} else { //실행중
					scriptHtml += '<div class="badge badge-pill badge-warning"><spring:message code="dashboard.running" /></div>';
				}

				if(scdHK == 'TC001605') { 				//1회실행
					scriptHtml += schedule_one_time_run;
				} else if(scdHK == 'TC001601') { 		//매일
					scriptHtml += schedule_everyday;
				} else if (scdHK == 'TC001602') {		//매주
					scriptHtml += schedule_everyweek;
				} else if (scdHK == 'TC001603') {		//매월
					scriptHtml += schedule_everymonth;
				} else if(scdHK == 'TC001604') {	//매년
					scriptHtml += schedule_everyyear;
				}
				scriptHtml += '<br/>';

				ampm = item.exe_hh >= 12 ? 'pm' : 'am';
				hours = item.exe_hh % 12;
				hours = hours.length < 2 ? '0'+hours : hours;
				minutes = item.exe_mm.length < 2 ? '0'+item.exe_mm : item.exe_mm;

				scriptHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + hours + ":" + minutes + " " + ampm;

				scriptCount = scriptCount + 1;
				scriptHtml += '</td>';
			}

			//4의 배수일때 tr 추가
			if (scriptCount % 4 == 0)  {
				scriptHtml += "</tr>";
				scriptHtml += "<tr>";
			}
		});

		scriptHtml += "</tr>";
	} else {
		backHtml += "<tr>";
		backHtml += '<td class="text-center" style="width:100%;border:none;height:20px;background-color:#c9ccd7;">';
		backHtml += dashboard_msg03
		backHtml += '</td>';
		backHtml += "</tr>";
	}

	$("#scriptScheduleCntList").html(scriptHtml);
	/////////////////////배치일정 end////////////////////////////////////////////////
}

/* ********************************************************
 * 스케줄 이력 설정
 ******************************************************** */
function fn_schedule_History_set(result) {
	var scdHisHtml = "";
	var scdHisChartHtml = "";
	var chartText = "";
	var chartColor = "";
	var chartCnt = 0;
	var chartMaxCnt = "";
	var chartWidth = "";
	var chartListCnt = 0;
	var db2_pgYn = "";
	
	///////////////////////////스케줄 list start ////////////////////////
	if (result.scheduleHistoryresult != null && result.scheduleHistoryresult.length > 0) {
		$(result.scheduleHistoryresult).each(function (index, item) {
			scdHisHtml +='	<tr>';
			
			scdHisHtml +='		<td><span onClick="javascript:fn_scdLayer('+item.scd_id+');" class="bold">'+item.scd_nm+'</span></td>';

			scdHisHtml +='		<td class="text-center">';
			if (item.bsn_dscd == "TC001901") {
				scdHisHtml += '<i class="ti-files text-primary"></i>';
				scdHisHtml += "&nbsp;" + dashboard_backup;
			} else if (item.bsn_dscd == "TC001902") {
				scdHisHtml += '<i class="fa fa-share-square-o text-success"></i>';
				scdHisHtml += "&nbsp;" + dashboard_script;
			} else {
				scdHisHtml += '<i class="ti-server text-warning"></i>';
				scdHisHtml += "&nbsp;" + dashboard_migration;
			}
			scdHisHtml +='	</td>';
			
			scdHisHtml +='		<td class="text-center">'+item.wrk_strt_dtm+'</td>';
			scdHisHtml +='		<td class="text-center">'+item.wrk_end_dtm+'</td>';

			scdHisHtml +='		<td class="text-center">';
			if (item.exe_rslt_cd == "TC001701") {
				scdHisHtml += '<i class="fa fa-check text-primary">';
				scdHisHtml += '&nbsp;' + common_success + '</i>';
			} else if (item.exe_rslt_cd == "TC001702") {
				scdHisHtml += '<div class="badge badge-pill badge-danger " style="font-size: 0.75rem;cursor:pointer;" onclick="fn_failLog('+item.exe_sn+')">';
				scdHisHtml += '<i class="fa fa-times"></i>';
				scdHisHtml += common_failed;
				scdHisHtml += "</div>";

			} else {
				scdHisHtml += "<div class='badge badge-pill badge-warning' style='color: #fff;'>";
				scdHisHtml += "	<i class='fa fa-spin fa-spinner mr-2' ></i>";
				scdHisHtml += '&nbsp;' + etc_etc28;
				scdHisHtml += "</div>";
			}
			scdHisHtml +='	</td>';

			scdHisHtml +='	</tr>';
		});

	} else {
		scdHisHtml += "<tr>";
		scdHisHtml += '<td class="text-center" colspan="5" style="width:100%;border:none;height:20px;background-color:#c9ccd7;">';
		scdHisHtml += dashboard_msg04
		scdHisHtml += '</td>';
		scdHisHtml += "</tr>";
	}

	$("#scheduleListT").html(scdHisHtml);
	///////////////////////////스케줄 list end ////////////////////////

	///////////////////////////스케줄 chart start ////////////////////////
	if (result.scheduleHistoryChart != null) {
		chartListCnt = 1;
	}
	
	db2_pgYn = nvlPrmSet($("#db2pg_yn", "#dashboardViewForm").val(), "N");

	if (db2_pgYn == "Y") {
		if ($("#scheduleHistChart").length) {
			var back_tot_cnt = 0; back_suc_cnt = 0; back_fal_cnt = 0;
			var script_tot_cnt = 0; script_suc_cnt = 0; script_fal_cnt = 0;
			var db2_pg_tot_cnt = 0; db2_pg_suc_cnt = 0; db2_pg_fal_cnt = 0;
			
			if  (chartListCnt > 0) {
				back_tot_cnt = nvlPrmSet(result.scheduleHistoryChart.back_tot_cnt, 0);
				back_suc_cnt = nvlPrmSet(result.scheduleHistoryChart.back_suc_cnt, 0);
				back_fal_cnt = nvlPrmSet(result.scheduleHistoryChart.back_fal_cnt, 0);
				script_tot_cnt = nvlPrmSet(result.scheduleHistoryChart.script_tot_cnt, 0);
				script_suc_cnt = nvlPrmSet(result.scheduleHistoryChart.script_suc_cnt, 0);
				script_fal_cnt = nvlPrmSet(result.scheduleHistoryChart.script_fal_cnt, 0);
				db2_pg_tot_cnt = nvlPrmSet(result.scheduleHistoryChart.db2_pg_tot_cnt, 0);
				db2_pg_suc_cnt = nvlPrmSet(result.scheduleHistoryChart.db2_pg_suc_cnt, 0);
				db2_pg_fal_cnt = nvlPrmSet(result.scheduleHistoryChart.db2_pg_fal_cnt, 0);
			}

			var schedulechart = Morris.Bar({
				element: 'scheduleHistChart',
				barColors: ['#76C1FA', '#63CF72', '#F36368'],
				data: [{
							scheduleGbn: dashboard_backup,
							tot_cnt: back_tot_cnt,
							suc_cnt: back_suc_cnt,
							fal_cnt: back_fal_cnt
						},
						{
							scheduleGbn: dashboard_script,
							tot_cnt: script_tot_cnt,
							suc_cnt: script_suc_cnt,
							fal_cnt: script_fal_cnt
						},
						{
							scheduleGbn: dashboard_migration,
							tot_cnt: db2_pg_tot_cnt,
							suc_cnt: db2_pg_suc_cnt,
							fal_cnt: db2_pg_fal_cnt
						}
				],
				xkey: 'scheduleGbn',
				ykeys: ['tot_cnt', 'suc_cnt', 'fal_cnt'],
				labels: [dashboard_progress_end, common_success, common_failed]
			});
		}
	} else {
		for (var i = 0; i < 7; i++) {
			scdHisChartHtml += '<tr>';
			chartMaxCnt = "100";
			chartCnt = "0";
			chartWidth = "0";

			if (i == 0) {
				chartText = dashboard_schedule_history_cht_msg1;
				chartColor = "bg-success";

			} else if (i == 1) {
				chartText = dashboard_schedule_history_cht_msg2;
				chartColor = "bg-warning";

			} else if (i == 2) {
				chartText = dashboard_schedule_history_cht_msg3;	
				chartColor = "bg-primary";

			} else if (i == 3) {
				chartText = dashboard_schedule_history_cht_msg4;
				chartColor = "bg-danger";

			} else if (i == 4) {
				chartText = dashboard_schedule_history_cht_msg5;
				chartColor = "bg-warning";

			} else if (i == 5) {
				chartText = dashboard_schedule_history_cht_msg6;
				chartColor = "bg-primary";

			} else if (i == 6) {
				chartText = dashboard_schedule_history_cht_msg7;
				chartColor = "bg-danger";
			}
			chartWidth = Math.floor(nvlPrmSet(chartWidth, 0));

			scdHisChartHtml += '	<td class="text-muted">' + chartText + '</td>';
			scdHisChartHtml += '	<td class="w-100 px-0">';
			scdHisChartHtml += '		<div class="progress progress-md mx-4">';
			scdHisChartHtml += '			<div id="scd_pro_' + i + '" class="progress-bar ' + chartColor + '" role="progressbar" style="width: ' + chartWidth + '%" aria-valuenow="' + chartWidth + '" aria-valuemin="0" aria-valuemax="' + chartMaxCnt + '"></div>';
			scdHisChartHtml += '		</div>';
			scdHisChartHtml += '	</td>';
			scdHisChartHtml += '	<td><h5 class="font-weight-bold mb-0" id="scd_pro_text_' + i + '">' + chartCnt + '</h5></td>';
			
			scdHisChartHtml += "</tr>";
		}

		$("#scheduleHistChart").html(scdHisChartHtml);
		
		//스케줄 프로그레스바 설정
		if (chartListCnt > 0) {
			setTimeout(fn_schedule_History_progres, 1000, result.scheduleHistoryChart);
		}
	}
}

/* ********************************************************
 * 스케줄 history 프로그레스바 loading
 ******************************************************** */
function fn_schedule_History_progres(result) {
	var chartCnt = 0;
	var chartWidth = "";

	for (var i = 0; i < 7; i++) {
		chartCnt = 0;
		chartWidth = "";
		
		if (i == 0) {
			chartCnt = nvlPrmSet(result.tot_cnt, "0");
			chartWidth = "100";
		} else if (i == 1) { //백업건수 / 전체건수
			chartCnt = nvlPrmSet(result.back_tot_cnt, "0");
			chartWidth = parseInt(nvlPrmSet(result.back_tot_cnt, "0")) / parseInt(nvlPrmSet(result.tot_cnt, "0")) * 100;
		} else if (i == 2) { //백업성공건수 / 전체건수
			chartCnt = nvlPrmSet(result.back_suc_cnt, "0");
			chartWidth = parseInt(nvlPrmSet(result.back_suc_cnt, "0")) / parseInt(nvlPrmSet(result.tot_cnt, "0")) * 100;
		} else if (i == 3) { //백업실패건수 / 전체건수
			chartCnt = nvlPrmSet(result.back_fal_cnt, "0");
			chartWidth = parseInt(nvlPrmSet(result.back_fal_cnt, "0")) / parseInt(nvlPrmSet(result.tot_cnt, "0")) * 100;
		} else if (i == 4) { //배치건수 / 전체건수
			chartCnt = nvlPrmSet(result.script_tot_cnt, "0");
			chartWidth = parseInt(nvlPrmSet(result.script_tot_cnt, "0")) / parseInt(nvlPrmSet(result.tot_cnt, "0")) * 100;
		} else if (i == 5) {
			chartCnt = nvlPrmSet(result.script_suc_cnt, "0");
			chartWidth = parseInt(nvlPrmSet(result.script_suc_cnt, "0")) / parseInt(nvlPrmSet(result.tot_cnt, "0")) * 100;
		} else if (i == 6) {
			chartCnt = nvlPrmSet(result.script_fal_cnt, "0") ;
			chartWidth = parseInt(nvlPrmSet(result.script_fal_cnt, "0")) / parseInt(nvlPrmSet(result.tot_cnt, "0")) * 100;
		}
		chartWidth = Math.floor(nvlPrmSet(chartWidth, 0));

		$("#scd_pro_" + i).css("width", chartWidth + "%"); 
		$("#scd_pro_text_" + i).html(chartCnt); 
	}
}


/* ********************************************************
 * 백업 이력 설정
 ******************************************************** */
function fn_backup_History_set(result) {
	var backHisHtml = "";
	
	///////////////////////////백업 list start ////////////////////////
	//데이터가 있는 경우
	if (result.backupHistoryresult != null && result.backupHistoryresult.length > 0) {
		$(result.backupHistoryresult).each(function (index, item) {
			backHisHtml +='	<tr>';
			
			backHisHtml +='		<td><span onClick=javascript:fn_workLayer("'+item.wrk_id+'"); class="bold" data-toggle="modal" title="'+item.wrk_nm+'">' + item.wrk_nm + '</span></td>';
			
			backHisHtml +='		<td class="text-center">';

			if (item.bck_bsn_dscd == 'TC000201') {
				if (item.bck_opt_cd == 'TC000301') {
					backHisHtml += '<i class="fa fa-paste mr-2 text-success"></i>';
					backHisHtml += backup_management_full_backup;
				} else if(item.bck_opt_cd == 'TC000302'){
					backHisHtml += '<i class="fa fa-paste mr-2 text-warning"></i>';
					backHisHtml += backup_management_incremental_backup;
				} else {
					backHisHtml += '<i class="fa fa-paste mr-2 text-info"></i>';
					backHisHtml += backup_management_change_log_backup;
				}
			} else {
				backHisHtml += '<i class="fa fa-file-code-o mr-2 text-danger"></i>';
				backHisHtml += dashboard_dump_backup;
			}
			backHisHtml +='	</td>';
			
			backHisHtml +='		<td class="text-center">'+item.wrk_strt_dtm+'</td>';
			backHisHtml +='		<td class="text-center">'+item.wrk_end_dtm+'</td>';
			
			backHisHtml +='		<td class="text-center">';
			if (item.exe_rslt_cd == "TC001701") {
				backHisHtml += '<i class="fa fa-check text-primary">';
				backHisHtml += '&nbsp;' + common_success + '</i>';
			} else if (item.exe_rslt_cd == "TC001702") {
				backHisHtml += '<div class="badge badge-pill badge-danger " style="font-size: 0.75rem;cursor:pointer;" onclick="fn_failLog('+item.exe_sn+')">';
				backHisHtml += '<i class="fa fa-times"></i>';
				backHisHtml += common_failed;
				backHisHtml += "</div>";

			} else {
				backHisHtml += "<div class='badge badge-pill badge-warning' style='color: #fff;'>";
				backHisHtml += "	<i class='fa fa-spin fa-spinner mr-2' ></i>";
				backHisHtml += '&nbsp;' + etc_etc28;
				backHisHtml += "</div>";
			}
			backHisHtml +='	</td>';
			
			backHisHtml +='	</tr>';
		});

	} else {
		backHisHtml += "<tr>";
		backHisHtml += '<td class="text-center" colspan="5" style="width:100%;border:none;height:20px;background-color:#c9ccd7;">';
		backHisHtml += dashboard_msg05
		backHisHtml += '</td>';
		backHisHtml += "</tr>";
	}

	$("#backupHistListT").html(backHisHtml);
	///////////////////////////백업 list end ////////////////////////

	///////////////////////////백업 chart start ////////////////////////
	if ($("#backupRmanHistChart").length) {
		var rmanchart = Morris.Bar({
						element: 'backupRmanHistChart',
						barColors: ['#76C1FA', '#FABA66', '#63CF72', '#F36368'],
						data: [{
							bck_opt_cd_nm: backup_management_full_backup,
							wrk_cnt: 0,
							schedule_cnt: 0,
							success_cnt: 0,
							fail_cnt: 0
							},
							{
								bck_opt_cd_nm: backup_management_incremental_backup,
								wrk_cnt: 0,
								schedule_cnt: 0,
								success_cnt: 0,
								fail_cnt: 0
							},
							{
								bck_opt_cd_nm: backup_management_change_log_backup,
								wrk_cnt: 0,
								schedule_cnt: 0,
								success_cnt: 0,
								fail_cnt: 0
							}
						],
						xkey: 'bck_opt_cd_nm',
						ykeys: ['wrk_cnt', 'schedule_cnt', 'success_cnt', 'fail_cnt'],
						labels: [common_registory, common_apply, common_success, common_failed]
		});

		if (result.backupRmanInfo != null) {
			var backupRmanChart = [];
			for(var i = 0; i<result.backupRmanInfo.length; i++){
				console.log(result.backupRmanInfo[i].bck_opt_cd);
				
				if (result.backupRmanInfo[i].bck_opt_cd == "TC000301") {
					result.backupRmanInfo[i].bck_opt_cd_nm = backup_management_full_backup;
				} else if (result.backupRmanInfo[i].bck_opt_cd == "TC000302") {
					result.backupRmanInfo[i].bck_opt_cd_nm = backup_management_incremental_backup;
				} else {
					result.backupRmanInfo[i].bck_opt_cd_nm = backup_management_change_log_backup;
				}
				
				backupRmanChart.push(result.backupRmanInfo[i]);
			}	
	
			rmanchart.setData(backupRmanChart);
		}
	}
	
	if ($("#backupDumpHistChart").length) {
		var dumpchart = Morris.Bar({
						element: 'backupDumpHistChart',
						barColors: ['#76C1FA', '#FABA66', '#63CF72', '#F36368'],
						data: [
						],
						xkey: 'db_nm',
						ykeys: ['wrk_cnt', 'schedule_cnt', 'success_cnt', 'fail_cnt'],
						labels: [common_registory, common_apply, common_success, common_failed]
		});

		if (result.backupDumpInfo != null) {
			dumpchart.setData(result.backupDumpInfo);
		}
	}
	///////////////////////////백업 chart end ////////////////////////
	setTimeout(function()
		{
			$("#a_back_hist").click()
		},500);
}

/* ********************************************************
 * 배치 이력 설정
 ******************************************************** */
function fn_script_History_set(result) {
	var scriptHisHtml = "";
	var chartListCnt = 0;

	///////////////////////////배치 list start ////////////////////////
	//데이터가 있는 경우
	if (result.scriptHistoryresult != null && result.scriptHistoryresult.length > 0) {
		$(result.scriptHistoryresult).each(function (index, item) {
			scriptHisHtml +='	<tr>';
			scriptHisHtml +='		<td><span onClick=javascript:fn_scriptLayer("'+item.wrk_id+'"); class="bold" data-toggle="modal" title="'+item.wrk_nm+'">' + item.wrk_nm + '</span></td>';
			scriptHisHtml +='		<td class="text-center">'+item.wrk_strt_dtm+'</td>';
			scriptHisHtml +='		<td class="text-center">'+item.wrk_end_dtm+'</td>';
			scriptHisHtml +='		<td class="text-center">'+item.wrk_dtm+'</td>';
			
			scriptHisHtml +='		<td class="text-center">';
			if (item.exe_rslt_cd == "TC001701") {
				scriptHisHtml += '<i class="fa fa-check text-primary">';
				scriptHisHtml += '&nbsp;' + common_success + '</i>';
			} else if (item.exe_rslt_cd == "TC001702") {
				scriptHisHtml += '<div class="badge badge-pill badge-danger " style="font-size: 0.75rem;cursor:pointer;" onclick="fn_failLog('+item.exe_sn+')">';
				scriptHisHtml += '<i class="fa fa-times"></i>';
				scriptHisHtml += common_failed;
				scriptHisHtml += "</div>";
			} else {
				scriptHisHtml += "<div class='badge badge-pill badge-warning' style='color: #fff;'>";
				scriptHisHtml += "	<i class='fa fa-spin fa-spinner mr-2' ></i>";
				scriptHisHtml += '&nbsp;' + etc_etc28;
				scriptHisHtml += "</div>";
			}
			scriptHisHtml +='	</td>';
			
			scriptHisHtml +='	</tr>';
		});

	} else {
		scriptHisHtml += "<tr>";
		scriptHisHtml += '<td class="text-center" colspan="5" style="width:100%;border:none;height:20px;background-color:#c9ccd7;">';
		scriptHisHtml += dashboard_msg05
		scriptHisHtml += '</td>';
		scriptHisHtml += "</tr>";
	}

	$("#scriptHistListT").html(scriptHisHtml);
	///////////////////////////배치 list end ////////////////////////

	///////////////////////////배치 chart start ////////////////////////
	if ($("#scriptHistChart").length) {
		var tot_cnt = 0; ins_cnt = 0; suc_cnt = 0; fal_cnt = 0;

		if  (result.scriptHistoryChart != null) {
			tot_cnt = nvlPrmSet(result.scriptHistoryChart.tot_cnt, 0);
			ins_cnt = nvlPrmSet(result.scriptHistoryChart.ins_cnt, 0);
			suc_cnt = nvlPrmSet(result.scriptHistoryChart.suc_cnt, 0);
			fal_cnt = nvlPrmSet(result.scriptHistoryChart.fal_cnt, 0);
		}

		var options = {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				},
				legend: {
					display: false
				},
				elements: {
					point: {
						radius: 0
					}
				}
		};
		
		var data = {
				labels: [common_registory, dashboard_progress_end, common_success, common_failed],
				datasets: [{
					label: '개수 :',
					data: [tot_cnt, ins_cnt, suc_cnt, fal_cnt],
					backgroundColor: [
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(255, 99, 132, 0.2)'
					],
					borderColor: [
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(255,99,132,1)'
					],
					borderWidth: 1,
					fill: false
				}]
		};

		var barChartCanvas = $("#scriptHistChart").get(0).getContext("2d");
		var barChart = new Chart(barChartCanvas, {
			type: 'bar',
			data: data,
			options: options
		});
	}
	///////////////////////////배치 chart end ////////////////////////
	setTimeout(function()
			{
				$("#a_script_hist").click()
			},500);
}

/* ********************************************************
 * migration setting
 ******************************************************** */
function fn_migration_history_set(result) {
	var checkDt = todayChkMonth + "" + todayChkDate;
	var checkYear = todayChkYear + "" + todayChkMonth + "" + todayChkDate; //전체 날짜
	var checkDay = todayChkDate;

	var migtHtml = "";
	var exe_perd_cd_val = "";
	var scdHK = "";
	var checkMons = "";
	var ampm ="";
	var hours = "";
	var migtCount=0;
	
	var migtHisHtml = "";

	/////////////////////migration 일정 start////////////////////////////////////////////////
	if (result.migtScdCnt != null && result.migtScdCnt > 0) {
		migtHtml += "<tr>";
		
		$(result.migtScdresult).each(function (index, item) {
			exe_perd_cd_val = item.exe_perd_cd;
			scdHK = "";
			var resultYearCheckDt = item.exe_month + "" + item.exe_day;
			
			if(exe_perd_cd_val == 'TC001605') {			//1회실행
				if(item.exe_dt == checkYear) {
					scdHK = 'TC001605';
				}
			} else if(exe_perd_cd_val == 'TC001601') {		//매일
				if(item.frst_reg_dtm <= checkYear) {
					scdHK = 'TC001601';
				}
			} else if(exe_perd_cd_val == 'TC001602') {		//매주
				if(item.frst_reg_dtm <= checkYear) {
					for(var i=0;i<7;i++){
						if(item.exe_dt.substr(i,1) == '1') {
							checkMons = i;
						}

						if (checkMons == todayChkDay) {
							scdHK = 'TC001602';
							continue;
						}
					}
				}
			} else if(exe_perd_cd_val == 'TC001603') {			//매월
				if(item.frst_reg_dtm <= checkYear) {
					if(item.exe_day == checkDay) {
						scdHK = 'TC001603';
					}
				}
			} else if(exe_perd_cd_val == 'TC001604') {
				if(item.frst_reg_dtm <= checkYear) {
					if(resultYearCheckDt == checkDt) {
						scdHK = 'TC001604';
					}
				}
			}

			if (scdHK != null && scdHK != "") {
				migtHtml += '<td style="width:33%;line-height:150%;border:none;">';
				
				migtHtml += "	<i class='fa fa-exchange mr-2 text-info' ></i>";
				migtHtml += "	<a class='nav-link_title' href='#' onclick='fn_scheduleListMove(\""+item.scd_nm+"\");'>";
				migtHtml += "		&nbsp;"+ item.scd_nm;
				migtHtml += "	</a>";
				migtHtml += '	<br/>';
				
				if (item.scd_cndt == 'TC001801') { //대기
					migtHtml += "	<i class='fa fa-circle mr-2 text-success' ></i>";
				} else { //실행중
					migtHtml += '	<div class="badge badge-pill badge-warning"><spring:message code="dashboard.running" /></div>';
				}
				
				if(scdHK == 'TC001605') { 				//1회실행
					migtHtml += schedule_one_time_run;
				} else if(scdHK == 'TC001601') { 		//매일
					migtHtml += schedule_everyday;
				} else if (scdHK == 'TC001602') {		//매주
					migtHtml += schedule_everyweek;
				} else if (scdHK == 'TC001603') {		//매월
					migtHtml += schedule_everymonth;
				} else if(scdHK == 'TC001604') {	//매년
					migtHtml += schedule_everyyear;
				}
				migtHtml += '<br/>';
				
				ampm = item.exe_hh >= 12 ? 'pm' : 'am';
				hours = item.exe_hh % 12;
				hours = hours.length < 2 ? '0'+hours : hours;
				minutes = item.exe_mm.length < 2 ? '0'+item.exe_mm : item.exe_mm;
				
				migtHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + hours + ":" + minutes + " " + ampm;
				
				migtCount = migtCount + 1;
				
				migtHtml += '</td>';
			}

			//4의 배수일때 tr 추가
			if (migtCount % 3 == 0)  {
				migtHtml += "</tr>";
				migtHtml += "<tr>";
			}
		});
		
		migtHtml += "</tr>";
	} else {
		migtHtml += "<tr>";
		migtHtml += '<td class="text-center" style="width:100%;border:none;height:20px;background-color:#c9ccd7;">';
		migtHtml += dashboard_msg02
		migtHtml += '</td>';
		migtHtml += "</tr>";
	}

	$("#migtHistCntList").html(migtHtml);
	/////////////////////migration 일정 end////////////////////////////////////////////////
	

/*	
	var chartText = "";
	var chartColor = "";
	var chartCnt = 0;
	var chartMaxCnt = "";
	var chartWidth = "";
	var chartListCnt = 0;
	var db2_pgYn = "";*/
	
	///////////////////////////migration list start ////////////////////////
	if (result.migtHistoryresult != null && result.migtHistoryresult.length > 0) {
		$(result.migtHistoryresult).each(function (index, item) {
			migtHisHtml +='	<tr>';
			
			migtHisHtml +='		<td>'+item.wrk_nm+'</td>';
			
			migtHisHtml +='		<td class="text-center">';
			if (item.migt_gbn == "DDL") {
				migtHisHtml += '<i class="fa fa-archive text-primary">';
			} else {
				migtHisHtml += '<i class="fa fa-file text-success">';
			}
			migtHisHtml += "&nbsp;" + item.migt_gbn;
			migtHisHtml += '</i>';
			migtHisHtml +='	</td>';
			
			migtHisHtml +='		<td class="text-center">'+item.wrk_strt_dtm+'</td>';
			migtHisHtml +='		<td class="text-center">'+item.wrk_end_dtm+'</td>';
			migtHisHtml +='		<td class="text-center">'+item.wrk_dtm+'</td>';
			
			migtHisHtml +='		<td class="text-center">';
			if (item.exe_rslt_cd == "TC001701") {
				if (item.migt_gbn == "DDL") {
					migtHisHtml += '<div class="badge badge-pill badge-primary " style="font-size: 0.75rem;cursor:pointer;" onclick="fn_dash_ddlResult(\''+item.mig_exe_sn+'\',\''+item.save_pth+'/\')">';
				} else {
					migtHisHtml += '<div class="badge badge-pill badge-primary " style="font-size: 0.75rem;cursor:pointer;" onclick="fn_dash_migtResult(\''+item.mig_exe_sn+'\',\''+item.save_pth+'/\')">';
				}
				migtHisHtml += '<i class="fa fa-check"></i>';
				migtHisHtml += common_success;
				migtHisHtml += "</div>";
			} else if(item.exe_rslt_cd == 'TC001702'){
				if (item.migt_gbn == "DDL") {
					migtHisHtml += '<div class="badge badge-pill badge-danger " style="font-size: 0.75rem;cursor:pointer;" onclick="fn_dash_ddlFailLog('+item.mig_exe_sn+')">';
				} else {
					migtHisHtml += '<div class="badge badge-pill badge-danger " style="font-size: 0.75rem;cursor:pointer;" onclick="fn_dash_migtFailLog('+item.mig_exe_sn+')">';
				}

				migtHisHtml += '<i class="fa fa-times"></i>';
				migtHisHtml += common_failed;
				migtHisHtml += "</div>";
			} else {
				migtHisHtml += "<div class='badge badge-pill badge-warning' style='color: #fff;'>";
				migtHisHtml += "	<i class='fa fa-spin fa-spinner mr-2' ></i>";
				migtHisHtml += '&nbsp;' + etc_etc28;
				migtHisHtml += "</div>";
			}
			migtHisHtml +='	</td>';

			migtHisHtml +='	</tr>';
		});

	} else {
		scdHisHtml += "<tr>";
		scdHisHtml += '<td class="text-center" colspan="6" style="width:100%;border:none;height:20px;background-color:#c9ccd7;">';
		scdHisHtml += dashboard_msg04
		scdHisHtml += '</td>';
		scdHisHtml += "</tr>";
	}

	$("#migrationListT").html(migtHisHtml);
	///////////////////////////migration list end ////////////////////////
}

/* ********************************************************
 * DDL추출 로그 팝업
 ******************************************************** */
function fn_dash_ddlResult(mig_exe_sn, ddl_save_pth){
	$.ajax({
			url : "/db2pg/popup/db2pgResultDDL.do", 
			data : {
		  		mig_exe_sn : mig_exe_sn,
		  		ddl_save_pth :ddl_save_pth
		  	},
			dataType : "json",
			type : "post",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("AJAX", true);
			},
			error : function(xhr, status, error) {
				if(xhr.status == 401) {
					showSwalIconRst(message_msg02, closeBtn, '', 'error', 'top');
				} else if(xhr.status == 403) {
					showSwalIconRst(message_msg03, closeBtn, '', 'error', 'top');
				} else {
					showSwalIcon("ERROR CODE : "+ xhr.status+ "\n\n"+ "ERROR Message : "+ error+ "\n\n"+ "Error Detail : "+ xhr.responseText.replace(/(<([^>]+)>)/gi, ""), closeBtn, '', 'error');
				}
			},
			success : function(result) {		
				$('#ddl_result_wrk_nm').html("");
				$('#ddl_result_wrk_exp').html("");
				$('#ddl_result_exe_rslt_cd').html("");	
				
				fn_ddlResultInit();

				if (result.result != null) {
					$('#ddl_result_wrk_nm').html(result.result.wrk_nm);
					$('#ddl_result_wrk_exp').html(result.result.wrk_exp);
					$('#ddl_result_exe_rslt_cd').html('<i class="fa fa-check-circle text-primary" >&nbsp;' + common_success + '</i>');
				}

				if (result.ddl_save_pth != null && result.ddl_save_pth != "") {
					getDataResultList(result.ddl_save_pth);
				}

				$('#pop_layer_db2pgResultDDL').modal("show");
			}
	});
}

/* ********************************************************
 * MIGRATION 로그 팝업
 ******************************************************** */
function fn_dash_migtResult(mig_exe_sn, trans_save_pth){
	$.ajax({
			url : "/db2pg/popup/db2pgResult.do", 
		  	data : {
		  		mig_exe_sn : mig_exe_sn,
		  		trans_save_pth :trans_save_pth
		  	},
			dataType : "json",
			type : "post",
			beforeSend: function(xhr) {
		        xhr.setRequestHeader("AJAX", true);
		    },
			error : function(xhr, status, error) {
				if(xhr.status == 401) {
					showSwalIconRst(message_msg02, closeBtn, '', 'error', 'top');
				} else if(xhr.status == 403) {
					showSwalIconRst(message_msg03, closeBtn, '', 'error', 'top');
				} else {
					showSwalIcon("ERROR CODE : "+ xhr.status+ "\n\n"+ "ERROR Message : "+ error+ "\n\n"+ "Error Detail : "+ xhr.responseText.replace(/(<([^>]+)>)/gi, ""), closeBtn, '', 'error');
				}
			},
			success : function(result) {
				$('#mig_result_wrk_nm').html("");
				$('#mig_result_wrk_exp').html("");
				$('#mig_result_wrk_strt_dtm').html("");
				$('#mig_result_wrk_end_dtm').html("");
				$('#mig_result_wrk_dtm').html("");				
				$('#mig_result_exe_rslt_cd').html("");
				
				$('#mig_result_msg').html("");
				
				if (result.result != null) {
					$('#mig_result_wrk_nm').html(result.result.wrk_nm);
					$('#mig_result_wrk_exp').html(result.result.wrk_exp);
					$('#mig_result_wrk_strt_dtm').html(result.result.wrk_strt_dtm);
					$('#mig_result_wrk_end_dtm').html(result.result.wrk_end_dtm);
					$('#mig_result_wrk_dtm').html(result.result.wrk_dtm);
					
					$('#mig_result_exe_rslt_cd').html('<i class="fa fa-check-circle text-primary" >&nbsp;' + common_success + '</i>');
				}
				
				if(result.db2pgResult == null){
					$('#mig_result_msg').html("파일이 삭제되어 작업로그정보를 출력할 수 없습니다.");	
				}else{
					$('#mig_result_msg').html(result.db2pgResult.RESULT);	
				}

				$('#pop_layer_db2pgResult').modal("show"); 
			}
	});
}

/* ********************************************************
 * DDL 에러 로그 팝업
 *********************************************************/
function fn_dash_ddlFailLog(mig_exe_sn){
	$.ajax({
			url : "/db2pg/popup/db2pgDdlErrHistoryDetail.do", 
		  	data : {
		  		mig_exe_sn:mig_exe_sn
		  	},
			dataType : "json",
			type : "post",
			beforeSend: function(xhr) {
		        xhr.setRequestHeader("AJAX", true);
		    },
			error : function(xhr, status, error) {
				if(xhr.status == 401) {
					showSwalIconRst(message_msg02, closeBtn, '', 'error', 'top');
				} else if(xhr.status == 403) {
					showSwalIconRst(message_msg03, closeBtn, '', 'error', 'top');
				} else {
					showSwalIcon("ERROR CODE : "+ xhr.status+ "\n\n"+ "ERROR Message : "+ error+ "\n\n"+ "Error Detail : "+ xhr.responseText.replace(/(<([^>]+)>)/gi, ""), closeBtn, '', 'error');
				}
			},
			success : function(result) {
				$('#pop_wrk_nm').html("");
				$('#pop_wrk_exp').html("");
				$('#pop_wrk_strt_dtm').html("");
				$('#pop_wrk_end_dtm').html("");
				$('#pop_wrk_dtm').html("");
				$('#pop_exe_rslt_cd').html("");
				$("#pop_rslt_msg", "#subForm").val(""); 
				
				if (result.result != null) {
					$('#pop_wrk_nm').html(result.result.wrk_nm);
					$('#pop_wrk_exp').html(result.result.wrk_exp);
					$('#pop_wrk_strt_dtm').html(result.result.wrk_strt_dtm);
					$('#pop_wrk_end_dtm').html(result.result.wrk_end_dtm);
					$('#pop_wrk_dtm').html(result.result.wrk_dtm);
					$('#pop_exe_rslt_cd').html('<i class="fa fa-times text-danger">&nbsp;<spring:message code="common.failed" /></i>');
					$("#pop_rslt_msg", "#subForm").val(nvlPrmSet(result.result.rslt_msg, "")); 
				}

				$('#pop_layer_db2pgDdlErrHistoryDetail').modal("show");
			}
	});
}

/* ********************************************************
 * MIGRATION 에러 로그 팝업
 ******************************************************** */
function fn_dash_migtFailLog(mig_exe_sn){
	$.ajax({
			url : "/db2pg/popup/db2pgMigErrHistoryDetail.do", 
		  	data : {
		  		mig_exe_sn:mig_exe_sn
		  	},
			dataType : "json",
			type : "post",
			beforeSend: function(xhr) {
		        xhr.setRequestHeader("AJAX", true);
		    },
			error : function(xhr, status, error) {
				if(xhr.status == 401) {
					showSwalIconRst(message_msg02, closeBtn, '', 'error', 'top');
				} else if(xhr.status == 403) {
					showSwalIconRst(message_msg03, closeBtn, '', 'error', 'top');
				} else {
					showSwalIcon("ERROR CODE : "+ xhr.status+ "\n\n"+ "ERROR Message : "+ error+ "\n\n"+ "Error Detail : "+ xhr.responseText.replace(/(<([^>]+)>)/gi, ""), closeBtn, '', 'error');
				}
			},
			success : function(result) {
				$('#pop_wrk_nm').html("");
				$('#pop_wrk_exp').html("");
				$('#pop_wrk_strt_dtm').html("");
				$('#pop_wrk_end_dtm').html("");
				$('#pop_wrk_dtm').html("");
				$('#pop_exe_rslt_cd').html("");
				$("#pop_rslt_msg", "#subForm").val(""); 
				
				if (result.result != null) {
					$('#pop_wrk_nm').html(result.result.wrk_nm);
					$('#pop_wrk_exp').html(result.result.wrk_exp);
					$('#pop_wrk_strt_dtm').html(result.result.wrk_strt_dtm);
					$('#pop_wrk_end_dtm').html(result.result.wrk_end_dtm);
					$('#pop_wrk_dtm').html(result.result.wrk_dtm);
					$('#pop_exe_rslt_cd').html('<i class="fa fa-times text-danger">&nbsp;<spring:message code="common.failed" /></i>');
					$("#pop_rslt_msg", "#subForm").val(nvlPrmSet(result.result.rslt_msg, "")); 
				}

				$('#pop_layer_db2pgDdlErrHistoryDetail').modal("show");
			}
	});
}

/* ********************************************************
 * 스케줄관리 화면이동
 ******************************************************** */
function fn_scheduleListMove(scd_nm) {
	$("#scd_nm", "#dashboardViewForm").val(scd_nm);
	
	$("#dashboardViewForm").attr("action", "/selectScheduleListView.do");
	$("#dashboardViewForm").submit();
}
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%
	/**
	* @Class Name : dbServer.jsp
	* @Description : dbServer 화면
	* @Modification Information
	*
	*   수정일         수정자                   수정내용
	*  ------------    -----------    ---------------------------
	*  2017.05.31     최초 생성
	*
	* author 변승우 대리
	* since 2017.06.01
	*
	*/
%>

<script>
var table = null;

function fn_init() {
		/* ********************************************************
		 * 서버리스트 (데이터테이블)
		 ******************************************************** */
		table = $('#serverList').DataTable({
		scrollY : "300px",
		processing : true,
		searching : false,		
		columns : [
		{data : "rownum", defaultContent : "", targets : 0, orderable : false, checkboxes : {'selectRow' : true}}, 
		{data : "idx", className : "dt-center", defaultContent : ""},
		{data : "db_svr_nm", className : "dt-center", defaultContent : ""},
		{data : "ipadr", className : "dt-center", defaultContent : ""},
		{data : "dft_db_nm", className : "dt-center", defaultContent : ""},
		{data : "portno", className : "dt-center", defaultContent : ""},
		{data : "svr_spr_usr_id", className : "dt-center", defaultContent : ""},
		{data : "frst_regr_id", className : "dt-center", defaultContent : ""},
		{data : "frst_reg_dtm", className : "dt-center", defaultContent : ""},
		{data : "lst_mdfr_id", className : "dt-center", defaultContent : ""},
		{data : "lst_mdf_dtm", className : "dt-center", defaultContent : ""}
		]
	});


		/* ********************************************************
		 * 서버리스트 더블클릭
		 ******************************************************** */
		$('#serverList tbody').on('dblclick', 'tr', function () {
			var data = table.row( this ).data();		
			var db_svr_id = data.db_svr_id;
			window.open("/popup/dbServerRegReForm.do?db_svr_id="+db_svr_id,"dbServerRegRePop","location=no,menubar=no,resizable=yes,scrollbars=no,status=no,width=920,height=395,top=0,left=0");
		});
}


/* ********************************************************
 * 페이지 시작시, 서버 리스트 조회
 ******************************************************** */
$(window.document).ready(function() {
	fn_init();
	
  	$.ajax({
		url : "/selectDbServerList.do",
		data : {},
		dataType : "json",
		type : "post",
		error : function(xhr, status, error) {
			alert("실패")
		},
		success : function(result) {
			table.clear().draw();
			table.rows.add(result).draw();
		}
	}); 
 
});


/* ********************************************************
 * 서버리스트 조회 (검색조건 입력)
 ******************************************************** */
function fn_search(){
	$.ajax({
		url : "/selectDbServerList.do",
		data : {
			db_svr_nm : $("#db_svr_nm").val(),
			ipadr : $("#ipadr").val(),
			dft_db_nm : $("#dft_db_nm").val(),
		},
		dataType : "json",
		type : "post",
		error : function(xhr, status, error) {
			alert("실패")
		},
		success : function(result) {
			table.clear().draw();
			table.rows.add(result).draw();
		}
	});
}


/* ********************************************************
 * 서버 등록 팝업페이지 호출
 ******************************************************** */
function fn_reg_popup(){
	window.open("/popup/dbServerRegForm.do","dbServerRegPop","location=no,menubar=no,resizable=yes,scrollbars=no,status=no,width=920,height=395,top=0,left=0");
}


/* ********************************************************
 * 서버 수정 팝업페이지 호출
 ******************************************************** */
function fn_regRe_popup(){
	var datas = table.rows('.selected').data();
	if (datas.length == 1) {
		var db_svr_id = table.row('.selected').data().db_svr_id;
		window.open("/popup/dbServerRegReForm.do?db_svr_id="+db_svr_id,"dbServerRegRePop","location=no,menubar=no,resizable=yes,scrollbars=no,status=no,width=920,height=395,top=0,left=0");
	} else {
		alert("하나의 항목을 선택해주세요.");
	}	
}
</script>




<div id="contents">
	<div class="contents_wrap">
		<div class="contents_tit">
			<h4>DB 서버 화면 <a href="#n"><img src="../images/ico_tit.png" alt="" /></a></h4>
			<div class="location">
				<ul>
					<li>Admin</li>
					<li>DB서버관리</li>
					<li class="on">DB 서버</li>
				</ul>
			</div>
		</div>


		<div class="contents">
			<div class="cmm_grp">
				<div class="btn_type_01">
					<span class="btn"><button onClick="fn_search()">조회</button></span>
					<span class="btn" onclick="fn_reg_popup();"><button>등록</button></span>
					<span class="btn" onclick="fn_regRe_popup();"><button>수정</button></span>
					<a href="#n" class="btn"><span>삭제</span></a>
				</div>
				<div class="sch_form">
					<table class="write">
						<caption>DB Server 조회하기</caption>
						<colgroup>
							<col style="width: 70px;" />
							<col />
							<col style="width: 70px;" />
							<col />
							<col style="width: 90px;" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th scope="row" class="t2">서버명</th>
								<td><input type="text" class="txt" name="db_svr_nm" id="db_svr_nm" /></td>
								<th scope="row" class="t3">아이피</th>
								<td><input type="text" class="txt" name="ipadr" id="ipadr" /></td>
								<th scope="row" class="t4">Database</th>
								<td><input type="text" class="txt" name="dft_db_nm" id="dft_db_nm" /></td>
							</tr>
						</tbody>
					</table>
				</div>
				<table id="serverList" class="cell-border display">
					<colgroup>
						<col style="width: 5%;" />
						<col style="width: 5%;" />
						<col style="width: 10%;" />
						<col style="width: 10%;" />
						<col style="width: 10%;" />
						<col style="width: 10%;" />
						<col style="width: 10%;" />
						<col style="width: 10%;" />
						<col style="width: 10%;" />
						<col style="width: 10%;" />
						<col style="width: 10%;" />
					</colgroup>

					<thead>
						<tr>
							<th></th>
							<th>No</th>
							<th>서버명</th>
							<th>아이피</th>
							<th>database</th>
							<th>포트</th>
							<th>User</th>
							<th>등록자</th>
							<th>등록일시</th>
							<th>수정자</th>
							<th>수정일시</th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
</div>

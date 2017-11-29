<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>


<div id="pop_layer" class="pop-layer">
		<div class="pop-container">
			<div class="pop_cts" style="width: 20%; padding: 20px; margin: 0 auto; min-height:0; min-width:0;" id="scdinfo">
				<p class="tit" style="margin-bottom: 15px;">스케줄 정보
					<a href="#n" class="btn" onclick="toggleLayer($('#pop_layer'), 'off');" style="float: right;"><img src="/images/ico_state_01.png"/></a>
				</p>
				<table class="list" style="border:1px solid #99abb0;">
					<caption>스케줄 정보</caption>
					<tbody>
						<tr>
							<td>스케줄명</td>
							<td id="scd_nm_info" ></td>
						</tr>	
						<tr>
							<td>스케줄 설명</td>
							<td id="scd_exp_info" ></td>
						</tr>	
						<tr>
							<td>실행상태</td>
							<td id="scd_cndt_info"></td>
						</tr>	
						<tr>
							<td>실행주기</td>
							<td id="exe_perd_cd_info"></td>
						</tr>	
						<tr>
							<td>실행일자</td>
							<td id="scd_exe_hms"></td>
						</tr>						
					</tbody>
				</table>		
		
				<div class="btn_type_02">
					<a href="#n" class="btn" onclick="toggleLayer($('#pop_layer'), 'off');"><span>닫기</span></a>
				</div>		
			</div>
		</div><!-- //pop-container -->
	</div>

	
	
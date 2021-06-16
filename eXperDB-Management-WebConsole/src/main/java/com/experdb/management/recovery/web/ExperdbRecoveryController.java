package com.experdb.management.recovery.web;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;


import com.experdb.management.recovery.service.ExperdbRecoveryService;

@Controller
public class ExperdbRecoveryController {
	
	@Autowired
	private ExperdbRecoveryService experdbRecoveryService;
	
	
	/**
	 * 완전 복구 View page
	 * @param historyVO, request
	 * @return ModelAndView
	 * @throws Exception
	 */
	@RequestMapping(value = "/experdb/completeRecovery.do")
	public ModelAndView completeRecovery(){
		ModelAndView mv = new ModelAndView();
		
		mv.setViewName("/eXperDB_Recovery/completeRecovery");
		return mv;
	}
	
	
	@RequestMapping(value = "/experdb/nodeInfoList.do")
	public @ResponseBody JSONObject getNodeInfoList(){
		JSONObject result = new JSONObject();
		
		result = experdbRecoveryService.getNodeInfoList();
		return result;
	}
	
	
	@RequestMapping(value = "/experdb/recStorageList.do")
	public @ResponseBody JSONObject getStorageList(HttpServletRequest request){
		JSONObject result = new JSONObject();
		
		result = experdbRecoveryService.getStorageList(request);
		
		return result;
	}
	
	@RequestMapping(value = "/experdb/recoveryDBList.do")
	public @ResponseBody JSONObject getRecoveryDBList(HttpServletRequest request){
		System.out.println("@@ getRecoveryDBList CONTROLLER @@");
		JSONObject result = new JSONObject();
		
		result = experdbRecoveryService.getRecoveryDBList();
		
		return result;
	}
	
	@RequestMapping(value = "/experdb/serverInfoFileRead.do")
	public @ResponseBody JSONObject serverInfoFileRead(MultipartHttpServletRequest request){
		JSONObject result = new JSONObject();
		
		try {
			result = experdbRecoveryService.serverInfoFileRead(request);
		} catch (IllegalStateException | IOException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	@RequestMapping(value = "/experdb/recoveryDBReg.do")
	public @ResponseBody JSONObject recoveryDBInsert(HttpServletRequest request){
		JSONObject result = new JSONObject();
		
		result = experdbRecoveryService.recoveryDBInsert(request);
		
		return result;
	}
	
	@RequestMapping(value = "/experdb/recoveryDBDelete.do")
	public @ResponseBody JSONObject recoveryDBDelete(HttpServletRequest request){
		System.out.println("### recoveryDBDelete CONTROLLER ##");
		JSONObject result = new JSONObject();
		
		result = experdbRecoveryService.recoveryDBDelete(request);
		
		return result;
	}

}

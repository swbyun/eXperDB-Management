package com.experdb.proxy.server;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.net.Socket;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.experdb.proxy.db.SqlSessionManager;
import com.experdb.proxy.socket.ProtocolID;
import com.experdb.proxy.socket.SocketCtl;
import com.experdb.proxy.socket.TranCodeType;

/**
 * Extension List 조회
 *
 * @author 박태혁
 * @see <pre>
 * == 개정이력(Modification Information) ==
 *
 *   수정일       수정자           수정내용
 *  -------     --------    ---------------------------
 *  2017.05.22   박태혁 최초 생성
 * </pre>
 */

public class DxT010 extends SocketCtl{
	
	private Logger errLogger = LoggerFactory.getLogger("errorToFile");
	private Logger socketLogger = LoggerFactory.getLogger("socketLogger");
	
	public DxT010(Socket socket, BufferedInputStream is, BufferedOutputStream	os) {
		this.client = socket;
		this.is = is;
		this.os = os;
	}

	public void execute(String strDxExCode, JSONObject dbInfoObj) throws Exception {
		socketLogger.info("DxT010.execute : " + strDxExCode);
		
		
		SqlSessionFactory sqlSessionFactory = null;
		
		sqlSessionFactory = SqlSessionManager.getInstance();
		JSONObject objSERVER_INFO = (JSONObject) dbInfoObj.get(ProtocolID.SERVER_INFO);
		
		String poolName = "" + objSERVER_INFO.get(ProtocolID.SERVER_IP) + "_" + objSERVER_INFO.get(ProtocolID.DATABASE_NAME) + "_" + objSERVER_INFO.get(ProtocolID.SERVER_PORT);
		
		Connection connDB = null;
		SqlSession sessDB = null;
		
		JSONObject outputObj = new JSONObject();
		
		try {
			
			SocketExt.setupDriverPool(objSERVER_INFO, poolName);
			
			//DB 컨넥션을 가져온다.
			connDB = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + poolName);
			sessDB = sqlSessionFactory.openSession(connDB);
			
			HashMap hp = new HashMap();
			hp.put("extname", dbInfoObj.get(ProtocolID.EXTNAME));

			List<Object> selectExtensionList = sessDB.selectList("app.selectPgExtensionList", hp);
			
			
			sessDB.close();
			connDB.close();
			
	        outputObj = ResultJSON(selectExtensionList, strDxExCode, "0", "", "");
	        
	        
	        byte[] sendBuff = outputObj.toString().getBytes();
	        
	        selectExtensionList = null;
	        hp = null;
	        outputObj = null;
	        
	        send(4, sendBuff);
	        
	        sendBuff = null;

	        

	        
			
		} catch (Exception e) {
			errLogger.error("DxT010 {} ", e.toString());
			
			outputObj.put(ProtocolID.DX_EX_CODE, TranCodeType.DxT010);
			outputObj.put(ProtocolID.RESULT_CODE, "1");
			outputObj.put(ProtocolID.ERR_CODE, TranCodeType.DxT010);
			outputObj.put(ProtocolID.ERR_MSG, "DxT010 Error [" + e.toString() + "]");
			
			byte[] sendBuff  = outputObj.toString().getBytes();
			send(4, sendBuff);
			
			outputObj = null;
			sendBuff= null;

		} finally {
			if(sessDB !=null) sessDB.close();
			if(connDB !=null) connDB.close();
		}	        


	}
}
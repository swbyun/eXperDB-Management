package com.k4m.dx.tcontrol.socket.listener;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.HashMap;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.json.simple.JSONObject;

import com.k4m.dx.tcontrol.db.SqlSessionManager;
import com.k4m.dx.tcontrol.db.repository.service.SystemServiceImpl;
import com.k4m.dx.tcontrol.db.repository.vo.DbServerInfoVO;
import com.k4m.dx.tcontrol.server.SocketExt;
import com.k4m.dx.tcontrol.socket.ProtocolID;
import com.k4m.dx.tcontrol.util.AES256;
import com.k4m.dx.tcontrol.util.AES256_KEY;
import com.k4m.dx.tcontrol.util.FileUtil;

public class ServerCheckListener implements Runnable {
	
	private SystemServiceImpl service;


	public ServerCheckListener(SystemServiceImpl service)  throws Exception {
		this.service = service;
	}
	
	@Override
	public void run() {
		int i=0;
		
		while(true) {
			
			try {
				
				String strIpadr = FileUtil.getPropertyValue("context.properties", "agent.install.ip");
				
				DbServerInfoVO vo = new DbServerInfoVO();
				vo.setIPADR(strIpadr);
					
				DbServerInfoVO dbServerInfoVO = service.selectDatabaseConnInfo(vo);
				
				String IPADR = dbServerInfoVO.getIPADR();
				int PORTNO = dbServerInfoVO.getPORTNO();
				String DB_SVR_NM = dbServerInfoVO.getDB_SVR_NM();
				String DFT_DB_NM = dbServerInfoVO.getDFT_DB_NM();
				String SVR_SPR_USR_ID = dbServerInfoVO.getSVR_SPR_USR_ID();
				String SVR_SPR_SCM_PWD = dbServerInfoVO.getSVR_SPR_SCM_PWD();
				
				AES256 aes = new AES256(AES256_KEY.ENC_KEY);
				
				JSONObject serverObj = new JSONObject();

				serverObj.put(ProtocolID.SERVER_NAME, DB_SVR_NM);
				serverObj.put(ProtocolID.SERVER_IP, IPADR);
				serverObj.put(ProtocolID.SERVER_PORT, PORTNO);
				serverObj.put(ProtocolID.DATABASE_NAME, DFT_DB_NM);
				serverObj.put(ProtocolID.USER_ID, SVR_SPR_USR_ID);
				serverObj.put(ProtocolID.USER_PWD, aes.aesDecode(SVR_SPR_SCM_PWD));
				
				String strMasterGbn = "";
				
				try {
					strMasterGbn = selectConnectInfo(serverObj);
					
					dbServerInfoVO.setMASTER_GBN(strMasterGbn);
					dbServerInfoVO.setDB_CNDT("Y");
					
					if(strMasterGbn.equals("M")) {
						service.updateDBSlaveAll(dbServerInfoVO);
					}
					
					service.updateDB_CNDT(dbServerInfoVO);

				} catch(Exception e) {
					strMasterGbn = "S";
					dbServerInfoVO.setMASTER_GBN(strMasterGbn);
					dbServerInfoVO.setDB_CNDT("N");
					
					service.updateDB_CNDT(dbServerInfoVO);
				}
				
				i++;

				Thread.sleep(3000);
				
			} catch(Exception e) {
				
			} finally {
				
			}
		}

	}
	
	private String selectConnectInfo(JSONObject serverInfoObj) throws Exception {
		

		SqlSessionFactory sqlSessionFactory = null;
		
		sqlSessionFactory = SqlSessionManager.getInstance();
		
		String poolName = "" + serverInfoObj.get(ProtocolID.SERVER_IP) + "_" + serverInfoObj.get(ProtocolID.DATABASE_NAME) + "_" + serverInfoObj.get(ProtocolID.SERVER_PORT);
		
		Connection connDB = null;
		SqlSession sessDB = null;
		
		String strMasterGbn = "";
		
		try {
			
			SocketExt.setupDriverPool(serverInfoObj, poolName);

			//DB 컨넥션을 가져온다.
			connDB = DriverManager.getConnection("jdbc:apache:commons:dbcp:" + poolName);

			sessDB = sqlSessionFactory.openSession(connDB);
			
			HashMap hp = (HashMap) sessDB.selectOne("app.selectMasterGbm");
				
			strMasterGbn = (String) hp.get("master_gbn");

		} catch(Exception e) {
			throw e;
		} finally {
			sessDB.close();
			connDB.close();
		}	
		
		return strMasterGbn;
		
	}

}
